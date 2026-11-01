import ownership from "@mrzr/eslint-plugin-component-ownership";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { ownership },
  },
  {
    // Screens arrange components; the look belongs to the components in core.
    files: ["src/features/**/*.tsx"],
    rules: {
      "ownership/one-component-per-file": "error",
      "ownership/no-external-styling": "error",
    },
  },
];
