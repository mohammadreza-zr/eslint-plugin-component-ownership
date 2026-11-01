# @mrzr/eslint-plugin-component-ownership

ESLint rules that keep a React component the owner of its file and of its look: a file holds one component, and the visual styling of an element lives in the component that owns it.

```bash
npm install --save-dev @mrzr/eslint-plugin-component-ownership
```

---

## The rules

| Rule | What it reports |
|---|---|
| [[one-component-per-file]] | A second component defined in one module |
| [[no-external-styling]] | A visual Tailwind class, or a variant that reaches into children, in a `className` outside the component that owns the look |

Both read only the syntax of one file. Neither fixes anything automatically.

## Limits

- **Components are recognised by shape.** A function or an arrow function with a PascalCase name, at the top level of the module, whose body contains JSX; or `memo` / `forwardRef` around one. A class component, a component declared inside another function, and an anonymous default export are not counted.
- **Class names are read where they are written.** A string in a `className` (or `…ClassName`) attribute or property, including strings inside `cn(...)`, a conditional, a template or an array. A class name built by a function you call is not seen.
- **The visual list is Tailwind's.** A class that is not a Tailwind utility is not reported, unless you add a pattern for it ([[no-external-styling]]).

---

## Pages

| Page | What is in it |
|---|---|
| [[Installation]] | Requirements and how to register the plugin |
| [[Quick-Start]] | A config, and what it reports |
| [[one-component-per-file]] | The rule, with what it counts and what it does not |
| [[no-external-styling]] | The rule, its options and the built-in list |
| [[Troubleshooting]] | Messages and what to do |
| [[FAQ]] | Short answers |
| [[Contributing]] | Working on the package, releasing |
