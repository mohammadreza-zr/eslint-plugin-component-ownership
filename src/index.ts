import { readFileSync } from "node:fs";
import type { ESLint } from "eslint";
import { noExternalStyling, type NoExternalStylingOptions } from "./rules/no-external-styling.js";
import { oneComponentPerFile } from "./rules/one-component-per-file.js";

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as { version: string };

const plugin: ESLint.Plugin = {
  meta: { name: "@mrzr/eslint-plugin-component-ownership", version },
  rules: {
    "one-component-per-file": oneComponentPerFile,
    "no-external-styling": noExternalStyling,
  },
};

export default plugin;
export { VISUAL_UTILITIES } from "./rules/no-external-styling.js";
export type { NoExternalStylingOptions };
