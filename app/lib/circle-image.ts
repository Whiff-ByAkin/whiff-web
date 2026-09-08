import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

// Supply public/whiff-circle.png, then reload in development or rebuild for
// production. No browser request to a missing asset or client-side flicker.
export function circleImage() {
  return existsSync(path.join(process.cwd(),"public","whiff-circle.png")) ? "/whiff-circle.png" : undefined;
}
