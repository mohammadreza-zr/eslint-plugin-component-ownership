# @mrzr/eslint-plugin-component-ownership

ESLint rules that keep a React component the owner of its file and of its look.

- **`one-component-per-file`**: a module defines one component. A second one is reported where it is declared.
- **`no-external-styling`**: visual Tailwind classes (colour, type, border, radius, shadow, inner spacing, motion) are reported outside the component that owns the look. Layout and sizing classes stay allowed.

```bash
npm install --save-dev @mrzr/eslint-plugin-component-ownership
```

---

## Quick start

In `eslint.config.js`, register the plugin and turn the rules on for the folders where they should hold. This is [`examples/basic`](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/tree/main/examples/basic), where the rules apply to `src/features` and not to `src/core`:

<!-- verbatim: examples/basic/eslint.config.js -->
```js
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
```

Running `eslint src` there prints, for `src/features/profile.tsx`:

<!-- verbatim: examples/basic/expected-output.txt -->
```text

src/features/profile.tsx
  2:25  error  `rounded-full` styles an element from outside a component. Move it into the component's variants, or make the styled element a component  ownership/no-external-styling
  5:17  error  `Profile` is a second component in this file. Move it into its own file (one component per file)                                          ownership/one-component-per-file
  7:24  error  `bg-card` styles an element from outside a component. Move it into the component's variants, or make the styled element a component       ownership/no-external-styling
  7:24  error  `p-4` styles an element from outside a component. Move it into the component's variants, or make the styled element a component           ownership/no-external-styling
  9:53  error  `text-primary` styles an element from outside a component. Move it into the component's variants, or make the styled element a component  ownership/no-external-styling

✖ 5 problems (5 errors, 0 warnings)
```

`src/core/button.tsx` has two components and visual classes, and is not reported, because the rules are off there.

---

## Documentation

Everything is in the **[Wiki](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki)**: [Installation](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/Installation) · [Quick start](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/Quick-Start) · [one-component-per-file](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/one-component-per-file) · [no-external-styling](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/no-external-styling) · [Troubleshooting](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/Troubleshooting) · [FAQ](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/FAQ) · [Contributing](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/Contributing)

## Requirements

ESLint 9 or newer with a flat config, and a parser that reads JSX (for TypeScript, `typescript-eslint`). The tests run with ESLint 10.12 and typescript-eslint 8, on Node.js `^20.19.0 || ^22.13.0 || >=24`.

## License

MIT
