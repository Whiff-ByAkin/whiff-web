export const runtime = "nodejs";

const DEFAULT_WORKER_URL = "https://whiff-story-ai.olettrasocials.workers.dev";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_REPLY_LENGTH = 2600;
const MAX_STORY_LENGTH = 2000;
const MAX_TITLE_LENGTH = 44;
const MAX_TAG_LENGTH = 28;

type StoryAiMode = "chat" | "summary";
type StoryAiMessage = {
  role: "user" | "assistant";
  content: string;
};

type StoryAiPayload = {
  mode?: unknown;
  messages?: unknown;
};

type WorkerResponse = {
  reply?: unknown;
  error?: unknown;
};

export async function POST(request: Request) {
  let payload: StoryAiPayload;

  try {
    payload = (await request.json()) as StoryAiPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const mode: StoryAiMode = payload.mode === "summary" ? "summary" : "chat";
  const messages = cleanMessages(payload.messages);

  if (!messages.length) {
    return Response.json({ error: "Add a message first." }, { status: 400 });
  }

  if (mode === "summary" && !messages.some((message) => message.role === "user")) {
    return Response.json(
      { error: "Tell whiff what happened before making a draft." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(getWorkerUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, messages }),
      signal: AbortSignal.timeout(18000),
    });

    const data = (await response.json().catch(() => ({}))) as WorkerResponse;

    if (!response.ok) {
      throw new Error(
        typeof data.error === "string" ? data.error : "Story AI request failed.",
      );
    }

    const reply = cleanBlockText(data.reply).slice(0, MAX_REPLY_LENGTH);

    if (!reply) {
      throw new Error("Story AI returned an empty reply.");
    }

    return Response.json(
      mode === "summary" ? { reply, summary: parseSummary(reply) } : { reply },
    );
  } catch (error) {
    console.error("Story AI proxy failed", error);

    return Response.json(
      { error: "whiff bot is taking a break. Try again in a moment." },
      { status: 502 },
    );
  }
}

function getWorkerUrl() {
  return process.env.WHIFF_STORY_AI_URL || DEFAULT_WORKER_URL;
}

function cleanMessages(value: unknown): StoryAiMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .flatMap((message): StoryAiMessage[] => {
      if (!message || typeof message !== "object") return [];

      const role = "role" in message ? message.role : undefined;
      const content = "content" in message ? cleanBlockText(message.content) : "";

      if ((role !== "user" && role !== "assistant") || !content) return [];

      return [{ role, content: content.slice(0, MAX_MESSAGE_LENGTH) }];
    })
    .slice(-MAX_MESSAGES);
}

function parseSummary(reply: string) {
  const tagsMatch = reply.match(/\btags?:\s*([\s\S]*)$/i);
  const titleMatch = reply.match(/\btitle:\s*(.+)/i);
  const storyMatch = reply.match(/\bstory:\s*([\s\S]*?)(?:\n\s*tags?:|$)/i);
  const withoutTags = tagsMatch ? reply.slice(0, tagsMatch.index).trim() : reply;
  const parts = withoutTags
    .split(/\n{2,}/)
    .map(cleanBlockText)
    .filter(Boolean);

  const title =
    cleanInlineText(titleMatch?.[1]) ||
    cleanInlineText(parts.length > 1 ? parts[0] : "Dating app experience");
  const parsedStory =
    cleanBlockText(storyMatch?.[1]) ||
    cleanBlockText(parts.length > 1 ? parts.slice(1).join("\n\n") : withoutTags);
  const storyParts = separateInlineTags(parsedStory);
  const tags = (tagsMatch?.[1] || storyParts.inlineTags || "")
    .split(/[,\n]/)
    .map((tag) => cleanInlineText(tag).replace(/^[-*]\s*/, ""))
    .filter(Boolean)
    .slice(0, 5)
    .map((tag) => trimToWord(tag, MAX_TAG_LENGTH));

  return {
    title: trimToWord(title || "Dating app experience", MAX_TITLE_LENGTH),
    story: trimToLength(storyParts.story || withoutTags, MAX_STORY_LENGTH),
    tags,
  };
}

function separateInlineTags(story: string) {
  const match = story.match(
    /^(.*?[.!?])\s+([a-z][a-z0-9 -]+,\s*[a-z][a-z0-9 -]+(?:,\s*[a-z][a-z0-9 -]+){1,4})\.?$/i,
  );

  if (!match) {
    return { story, inlineTags: "" };
  }

  return {
    story: match[1].trim(),
    inlineTags: match[2].trim(),
  };
}

function cleanBlockText(value: unknown) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

function cleanInlineText(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function trimToLength(value: string, maxLength: number) {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;

  return trimToWord(trimmed, maxLength - 3) + "...";
}

function trimToWord(value: string, maxLength: number) {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;

  return trimmed.slice(0, maxLength).trimEnd().replace(/\s+\S*$/, "");
}
