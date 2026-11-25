import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The deliverable for this bounty is the set of X posts named in POSTS.json.
// This program copies POSTS.json from the bot directory into the output
// directory so the grader can read exactly which posts the entry claims.

const POSTS_FILENAME = "POSTS.json";

const scriptDir = dirname(fileURLToPath(import.meta.url));

const botDir = process.env.MAKEFUN_BOT_DIR
  ? resolve(process.cwd(), process.env.MAKEFUN_BOT_DIR)
  : scriptDir;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.cwd(), process.env.MAKEFUN_OUTPUT_DIR)
  : "/output";

const sourcePath = join(botDir, POSTS_FILENAME);
if (!existsSync(sourcePath)) {
  throw new Error(`${POSTS_FILENAME} not found in bot directory: ${botDir}`);
}

// Create the output directory if needed. Never remove the directory itself
// (the grader may mount it); only clear its entries.
mkdirSync(outputDir, { recursive: true });
for (const entry of readdirSync(outputDir)) {
  rmSync(join(outputDir, entry), { recursive: true, force: true });
}

copyFileSync(sourcePath, join(outputDir, POSTS_FILENAME));
console.log(`Wrote ${join(outputDir, POSTS_FILENAME)}`);
