import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { performInit } from "./init.js";

test("performInit initializes git and generates the initial tree file", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "oh-my-harness-init-"));
  const targetRoot = path.join(tempRoot, "project");
  const fakeHome = path.join(tempRoot, "home");
  await mkdir(targetRoot, { recursive: true });
  await mkdir(fakeHome, { recursive: true });

  const previousHome = process.env.HOME;
  const previousUserProfile = process.env.USERPROFILE;
  process.env.HOME = fakeHome;
  process.env.USERPROFILE = fakeHome;

  try {
    const summary = await performInit({
      targetRoot,
      force: false,
      global: false,
      dryRun: false,
      locale: "zh",
    });

    await stat(path.join(targetRoot, ".git"));
    const tree = await readFile(
      path.join(targetRoot, ".oh-my-harness", "tree.md"),
      "utf8",
    );

    assert.match(tree, /# Tree/);
    assert.match(tree, /git ls-files --cached --others --exclude-standard/);
    assert(summary.some((entry) =>
      entry.target.endsWith(`${path.sep}.git`) && entry.kind === "created"
    ));
    assert(summary.some((entry) =>
      entry.target.endsWith(`${path.sep}.oh-my-harness${path.sep}tree.md`)
      && entry.kind === "created"
    ));
  } finally {
    if (previousHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = previousHome;
    }

    if (previousUserProfile === undefined) {
      delete process.env.USERPROFILE;
    } else {
      process.env.USERPROFILE = previousUserProfile;
    }
  }
});
