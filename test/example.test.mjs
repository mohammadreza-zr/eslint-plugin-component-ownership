import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const example = join(root, "examples/basic");
const eslint = join(root, "node_modules/.bin/eslint");

test("the example project prints exactly the committed output", () => {
  const r = spawnSync(eslint, ["src"], {
    cwd: example,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  assert.equal(r.status, 1);
  assert.equal(r.stdout.replaceAll(`${example}/`, ""), readFileSync(join(example, "expected-output.txt"), "utf8"));
});

test("in the example, the rules are on in features and off in core", () => {
  const r = spawnSync(eslint, ["--format", "json", "src"], { cwd: example, encoding: "utf8" });
  const files = JSON.parse(r.stdout).map((f) => [f.filePath.replace(`${example}/`, ""), f.messages.length]);
  assert.deepEqual(files, [["src/core/button.tsx", 0], ["src/features/profile.tsx", 5]]);
});
