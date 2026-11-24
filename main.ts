// The Worst App Idea Ever Pitched — make.fun competition
// u-plucky-sparrow-67-the-worst-app-idea-ever-pitched-a0396b23
// Writes one sentence (at most 240 characters) pitching a gloriously useless
// app to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Deterministic: the same fixed text on every run, no randomness, no network, no clock.
//
// NOTE: never change permissions on the output directory or files here. The grading
// sandbox runs as uid 65534 and changing permissions on a directory it does not own
// throws EPERM (exit 1). Instead we set a permissive umask up front so files we
// create land as 0644 and directories as 0755 on their own.
process.umask(0o022);

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch. Damp photographs a houseplant the owner can already see from the
// couch and charges a monthly subscription to report the obvious. One
// sentence, founder-serious, no second idea crowding it.
const PITCH =
  "Meet Damp, an app that takes a photo of your houseplant every twenty minutes and texts you 'still alive, probably,' for $9.99 a month, because peace of mind should never be free.";

function main(): void {
  // Gate: /output/entry.txt must be UTF-8 text of 1 to 240 characters,
  // not only white space. Fail loudly here rather than ship an invalid entry.
  if (PITCH.length < 1 || PITCH.length > 240 || PITCH.trim().length === 0) {
    throw new Error(`pitch must be 1-240 non-blank characters, got ${PITCH.length}`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, PITCH + "\n", "utf8");

  // Read back what we wrote and re-check the gate on the text on disk,
  // so a bad write (or a pitch edited past 240 chars) fails in our own run.
  const written = readFileSync(outPath, "utf8");
  const text = written.replace(/\n$/, "");
  if (text.length < 1 || text.length > 240 || text.trim().length === 0) {
    throw new Error(`entry.txt failed the 1-240 character gate, got ${text.length}`);
  }
}

main();
