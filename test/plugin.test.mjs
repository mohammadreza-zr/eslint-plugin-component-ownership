import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { ESLint } from "eslint";
import tseslint from "typescript-eslint";

import plugin, { VISUAL_UTILITIES } from "../dist/index.js";

const lint = async (code, rules, filePath = "a.tsx") => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ["**/*.tsx"],
        languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
        plugins: { ownership: plugin },
        rules,
      },
    ],
  });
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages;
};

test("the plugin names itself and carries the package version", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.deepEqual(plugin.meta, { name: "@mrzr/eslint-plugin-component-ownership", version: pkg.version });
  assert.deepEqual(Object.keys(plugin.rules).sort(), ["no-external-styling", "one-component-per-file"]);
});

test("loaded in a flat config, the rules report with their own ids", async () => {
  const messages = await lint(
    'export const A = () => <a className="bg-red-500" />; export const B = () => <b />;',
    { "ownership/one-component-per-file": "error", "ownership/no-external-styling": "warn" },
  );
  assert.deepEqual(
    messages.map((m) => [m.ruleId, m.severity]),
    [["ownership/no-external-styling", 1], ["ownership/one-component-per-file", 2]],
  );
  assert.match(messages[1].message, /`B` is a second component in this file/);
  assert.match(messages[0].message, /`bg-red-500` styles an element from outside a component/);
});

test("rule options are validated by ESLint", async () => {
  await assert.rejects(
    lint("<div />", { "ownership/no-external-styling": ["error", { colour: [] }] }),
    /Unexpected property "colour"/,
  );
  await assert.rejects(
    lint("<div />", { "ownership/no-external-styling": ["error", { visual: "bg-" }] }),
    /should be array/,
  );
});

test("a regular expression that does not compile names the option", async () => {
  await assert.rejects(
    lint('<div className="x" />', { "ownership/no-external-styling": ["error", { visual: ["("] }] }),
    /@mrzr\/eslint-plugin-component-ownership: no-external-styling option "visual" has an invalid regular expression "\("/,
  );
  await assert.rejects(
    lint('<div className="x" />', { "ownership/no-external-styling": ["error", { allow: ["["] }] }),
    /option "allow" has an invalid regular expression/,
  );
});

test("the built-in list of visual utilities is exported, and each entry is a regular expression", () => {
  assert.ok(VISUAL_UTILITIES.length >= 20);
  assert.ok(VISUAL_UTILITIES.every((p) => p instanceof RegExp));
});

test("each rule has a description and a link to its wiki page", () => {
  for (const [name, rule] of Object.entries(plugin.rules)) {
    assert.ok(rule.meta.docs.description.length > 10, name);
    assert.equal(rule.meta.docs.url, `https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/${name}`);
  }
});

test("the plugin can be registered under another name", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ["**/*.tsx"],
        languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
        plugins: { mine: plugin },
        rules: { "mine/no-external-styling": "error" },
      },
    ],
  });
  const [result] = await eslint.lintText('<p className="bg-card" />', { filePath: "a.tsx" });
  assert.deepEqual(result.messages.map((m) => m.ruleId), ["mine/no-external-styling"]);
});
