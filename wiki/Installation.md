# Installation

```bash
npm install --save-dev @mrzr/eslint-plugin-component-ownership
# or
pnpm add --save-dev @mrzr/eslint-plugin-component-ownership
yarn add --dev @mrzr/eslint-plugin-component-ownership
```

---

## Requirements

| | |
|---|---|
| **ESLint** | 9 or newer, with a flat config (`eslint.config.js`). The tests run with 10.12. |
| **A parser for JSX** | For TypeScript, `typescript-eslint` with `ecmaFeatures: { jsx: true }`; for `.jsx` files, ESLint's own parser. |
| **Node.js** | The versions ESLint 10 runs on: `^20.19.0 || ^22.13.0 || >=24`. |

The plugin has no dependencies of its own.

## Registering it

```js
import ownership from "@mrzr/eslint-plugin-component-ownership";

export default [
  { plugins: { ownership } },
];
```

Under the key `ownership` the rules are `ownership/one-component-per-file` and `ownership/no-external-styling`. The key is yours to choose, and the rules take it: `plugins: { mine: ownership }` gives `mine/no-external-styling`. ESLint's own convention for a scoped plugin is the key `@mrzr/component-ownership`.

The plugin sets `meta.name` to `@mrzr/eslint-plugin-component-ownership` and `meta.version` to the package version. It has no preset configs: you choose where each rule applies.

Next: [[Quick-Start]].
