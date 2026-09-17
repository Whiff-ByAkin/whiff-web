import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { GET as publicNotes, POST as submit } from "../app/api/roasts/route";
import { GET as reviewNotes, PATCH as moderate } from "../app/api/roasts/review/route";
import { POST as login, DELETE as logout } from "../app/api/roasts/session/route";
import { getPublicNote, moderateNote, insertNote } from "../app/lib/roast-store";
import { SESSION_COOKIE } from "../app/lib/roast-http";

let dir:string;
const password=randomUUID();
before(async()=>{
  dir=await mkdtemp(path.join(tmpdir(),"whiff-roast-test-"));
  Object.assign(process.env,{NODE_ENV:"test",ROAST_STORAGE:"file",ROAST_DATA_FILE:path.join(dir,"notes.json"),ROAST_ADMIN_PASSWORD:password});
});
beforeEach(async()=>{await writeFile(process.env.ROAST_DATA_FILE!,JSON.stringify({notes:[],limits:{}}));});
after(async()=>{await rm(dir,{recursive:true,force:true});});
const note={message:"The chairs look like they are trying to escape. Love the idea though.",name:"A visitor",color:"pink",consent:true,website:""};
function request(route:string,method="GET",data?:unknown,cookie?:string,origin="http://localhost") {
  return new NextRequest(`http://localhost/api/roasts${route}`,{method,headers:{...(data!==undefined?{"content-type":"application/json"}:{}),...(cookie?{cookie}:{}),origin},...(data!==undefined?{body:JSON.stringify(data)}:{})});
}
async function session() {
  const response=await login(request("/session","POST",{password}));
  assert.equal(response.status,200);
  const token=response.cookies.get(SESSION_COOKIE)?.value;
  assert.ok(token);
  return `${SESSION_COOKIE}=${token}`;
}

test("pending notes stay private; approval publishes; hiding removes them",async()=>{
  assert.equal((await submit(request("","POST",note))).status,201);
  assert.deepEqual((await (await publicNotes(request(""))).json()).notes,[]);
  assert.equal((await reviewNotes(request("/review"))).status,401);
  const cookie=await session();
  const pending=await (await reviewNotes(request("/review", "GET",undefined,cookie))).json();
  assert.equal(pending.notes.length,1);
  const id=pending.notes[0].id;
  assert.equal((await moderate(request("/review","PATCH",{id,status:"approved"},cookie))).status,200);
  const published=await (await publicNotes(request(""))).json();
  assert.equal(published.notes[0].message,note.message);
  assert.ok(published.notes[0].publishedAt);
  assert.equal("status" in published.notes[0],false);
  assert.equal((await moderate(request("/review","PATCH",{id,status:"rejected"},cookie))).status,200);
  assert.equal((await (await publicNotes(request(""))).json()).notes.length,0);
});

test("server validates lengths, types, consent, color and honeypot",async()=>{
  for(const invalid of [{message:"  "},{message:"a".repeat(401)},{name:"x".repeat(31)},{message:{bad:true}},{consent:false},{color:"red"},{website:"bot.example"}])
    assert.equal((await submit(request("","POST",{...note,...invalid}))).status,400);
  assert.equal((await submit(request("","POST",{...note,name:" "}))).status,201);
});

test("unauthenticated, forged and cross-origin moderation cannot publish",async()=>{
  assert.equal((await login(request("/session","POST",{password:"wrong"}))).status,401);
  assert.equal((await moderate(request("/review","PATCH",{id:randomUUID(),status:"approved"}))).status,401);
  const forged=`${SESSION_COOKIE}=${Date.now()+100000}.forged`;
  assert.equal((await reviewNotes(request("/review","GET",undefined,forged))).status,401);
  const cookie=await session();
  assert.equal((await moderate(request("/review","PATCH",{id:randomUUID(),status:"approved"},cookie,"https://unrelated.example"))).status,403);
  assert.equal((await submit(request("","POST",note,undefined,"https://unrelated.example"))).status,403);
  const response=await logout(request("/session","DELETE",undefined,cookie));
  assert.equal(response.cookies.get(SESSION_COOKIE)?.value,"");
  assert.match(response.headers.get("set-cookie")!,/HttpOnly/i);
});

test("submission and login limits survive repeated requests",async()=>{
  for(let i=0;i<5;i++) assert.equal((await submit(request("","POST",note))).status,201);
  assert.equal((await submit(request("","POST",note))).status,429);
  for(let i=0;i<10;i++) assert.equal((await login(request("/session","POST",{password:"wrong"}))).status,401);
  assert.equal((await login(request("/session","POST",{password}))).status,429);
});

test("a normalized internal localhost URL accepts the actual browser host",async()=>{
  const req=request("","POST",note,undefined,"http://127.0.0.1:3100");
  req.headers.set("host","127.0.0.1:3100");
  assert.equal((await submit(req)).status,201);
});

test("public pagination is stable and never includes a pending or rejected note",async()=>{
  const date=new Date().toISOString();
  for(let i=0;i<29;i++) await insertNote({id:randomUUID(),message:`Note ${i}`,name:"Anonymous",color:"yellow",status:i<27?"approved":"pending",createdAt:date,publishedAt:i<27?date:null});
  const first=await (await publicNotes(request(""))).json();
  assert.equal(first.notes.length,24); assert.ok(first.nextCursor);
  const second=await (await publicNotes(request(`?cursor=${first.nextCursor}`))).json();
  assert.equal(second.notes.length,3); assert.equal(second.nextCursor,null);
  assert.equal(new Set([...first.notes,...second.notes].map((n:{id:string})=>n.id)).size,27);
  assert.equal((await publicNotes(request("?cursor=not-valid"))).status,400);
});

test("oversized requests fail before saving and a missing note is 404",async()=>{
  assert.equal((await submit(request("","POST",{...note,message:"x".repeat(9000)}))).status,413);
  const cookie=await session();
  assert.equal((await moderate(request("/review","PATCH",{id:randomUUID(),status:"approved"},cookie))).status,404);
  assert.equal((await publicNotes(request(""))).headers.get("cache-control"),"no-store");
});

test("production never pretends local files are a shared database",async()=>{
  const previousUri=process.env.MONGODB_URI;
  const previousRoastUri=process.env.ROAST_MONGODB_URI;
  Object.assign(process.env,{NODE_ENV:"production"});
  delete process.env.MONGODB_URI;
  delete process.env.ROAST_MONGODB_URI;
  try {
    const response=await publicNotes(request(""));
    assert.equal(response.status,503);
    assert.match((await response.json()).error,/temporarily unavailable/);
  } finally {
    Object.assign(process.env,{NODE_ENV:"test"});
    if(previousUri!==undefined) process.env.MONGODB_URI=previousUri;
    if(previousRoastUri!==undefined) process.env.ROAST_MONGODB_URI=previousRoastUri;
  }
});


test("durable links expose only currently approved notes, including after hiding", async () => {
  const { getPublicRoast } = await import("../app/lib/public-roast");
  const { GET: image } = await import("../app/roast/[id]/og/route");
  const id = randomUUID();
  await insertNote({ id, message: "Private until approved", name: "Visitor", color: "pink", status: "pending", createdAt: new Date().toISOString(), publishedAt: null });
  assert.equal(await getPublicNote(id), null);
  assert.equal(await getPublicRoast(id), null);
  assert.equal((await image(new Request("http://localhost"), { params: Promise.resolve({ id }) })).status, 404);
  await moderateNote(id, "approved");
  const visible = await getPublicRoast(id);
  assert.equal(visible?.message, "Private until approved");
  assert.equal(visible?.source, "community");
  assert.equal("status" in visible!, false);
  assert.equal("_id" in visible!, false);
  await moderateNote(id, "rejected");
  assert.equal(await getPublicRoast(id), null);
  const hiddenImage = await image(new Request("http://localhost"), { params: Promise.resolve({ id }) });
  assert.equal(hiddenImage.status, 404);
  assert.equal(hiddenImage.headers.get("cache-control"), "no-store");
  assert.equal(await getPublicRoast(randomUUID()), null);
});

test("editorial routes and neutral share text work without storage", async () => {
  const { getPublicRoast } = await import("../app/lib/public-roast");
  const { TEAM_ROASTS, roastShareText, roastUrl } = await import("../app/lib/roast-content");
  const previous = process.env.ROAST_DATA_FILE;
  process.env.ROAST_DATA_FILE = "/dev/null/unavailable.json";
  try {
    for (const note of TEAM_ROASTS) {
      assert.deepEqual(await getPublicRoast(note.id), note);
      const text = roastShareText(note);
      assert.ok(text.includes(note.message));
      assert.ok(text.includes("Roast Whiff"));
      assert.equal(text.includes("The Whiff team"), false);
      assert.ok(text.endsWith(roastUrl(note.id)));
    }
    assert.equal(await getPublicRoast("not-a-roast"), null);
  } finally { process.env.ROAST_DATA_FILE = previous; }
});


test("saved images have square PNG dimensions, safe attachment names and the same approval gate", async () => {
  const { GET: image } = await import("../app/roast/[id]/og/route");
  const download = (id: string) => image(new Request(`http://localhost/roast/${id}/og?download=1`), { params: Promise.resolve({ id }) });
  const response = await download("friendship-syllabus");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("content-disposition"), 'attachment; filename="whiff-roast-friendship-syllabus.png"');
  const png = Buffer.from(await response.arrayBuffer());
  assert.equal(png.toString("ascii", 1, 4), "PNG");
  assert.equal(png.readUInt32BE(16), 1080);
  assert.equal(png.readUInt32BE(20), 1080);
  const preview = await image(new Request("http://localhost/roast/houseplants/og"), { params: Promise.resolve({ id: "houseplants" }) });
  const previewPng = Buffer.from(await preview.arrayBuffer());
  assert.equal(previewPng.readUInt32BE(16), 1200);
  assert.equal(previewPng.readUInt32BE(20), 630);
  assert.equal(preview.headers.get("content-disposition"), null);
  const id = randomUUID();
  await insertNote({ id, message: "Hidden submission", name: "Visitor", color: "pink", status: "pending", createdAt: new Date().toISOString(), publishedAt: null });
  assert.equal((await download(id)).status, 404);
  await moderateNote(id, "approved");
  const publicImage = await download(id);
  assert.equal(publicImage.status, 200);
  await publicImage.arrayBuffer();
  await moderateNote(id, "rejected");
  assert.equal((await download(id)).status, 404);
});
