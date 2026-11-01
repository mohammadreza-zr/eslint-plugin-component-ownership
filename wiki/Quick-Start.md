# Quick start

This page uses [`examples/basic`](https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/tree/main/examples/basic). The tests run `eslint` there and compare the output with the committed one, so what is shown is what the tool prints.

## 1. Register the plugin and choose where the rules apply

`eslint.config.js`:

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

The first block registers the plugin and the parser for `.tsx`. The second turns both rules on for `src/features`. Rules are not turned on by the plugin itself.

## 2. A file that breaks both rules

`src/features/profile.tsx`:

<!-- verbatim: examples/basic/src/features/profile.tsx -->
```tsx
function Avatar() {
  return <img className="size-8 rounded-full" alt="" />;
}

export function Profile() {
  return (
    <section className="flex gap-3 bg-card p-4">
      <Avatar />
      <h2 className={cn("min-w-0 flex-1", active && "text-primary")}>Name</h2>
    </section>
  );
}
```

## 3. Run ESLint

```bash
npx eslint src
```

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

- **Line 2:** `rounded-full` is a visual class on an element of a screen. `size-8` is a sizing class and is allowed.
- **Line 5:** `Profile` is the second component of the file. The first one, `Avatar`, is not reported.
- **Line 7:** `bg-card` and `p-4` are reported, `flex` and `gap-3` are not.
- **Line 9:** `text-primary` inside `cn(...)` is found. `min-w-0` and `flex-1` are allowed.

The exit code is 1, because the rules are on as `"error"`. Use `"warn"` to report without failing.

## 4. Where it is off

`src/core/button.tsx` has two components and `rounded-md bg-primary` classes, and is not reported, because the config does not turn the rules on there. A design system folder is where the look is meant to live.

## 5. Files that already break the rule

When you turn a rule on in a project that has files that break it, ESLint lets you use a different severity for a list of files. Put them in a later config block as `"warn"` and remove each one from the list when it is fixed:

```js
{
  files: ["src/features/old-screen.tsx"],
  rules: { "ownership/one-component-per-file": "warn" },
},
```
