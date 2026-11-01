# Changelog

## 0.1.0

First release.

- `one-component-per-file`: a module defines one component. A function or arrow function with a PascalCase name at the top level that contains JSX, or `memo` / `forwardRef` around one, counts; the second and later ones are reported at their name.
- `no-external-styling`: reports visual Tailwind utilities (colour, type, border, radius, shadow, inner spacing, motion) in `className` and `…ClassName` strings, and variants that reach into children, outside the component that owns the look. Options: `visual`, `builtins`, `allow`, `descendants`. The built-in list is exported as `VISUAL_UTILITIES`.
- Meant for ESLint 9 and newer with a flat config. Tested with ESLint 10.12 and typescript-eslint 8.
