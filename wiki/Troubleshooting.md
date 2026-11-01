# Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `Could not find plugin "ownership" in configuration.` | The plugin is not registered under that key. `plugins: { ownership }` makes the rules `components/…`; another key makes them `<key>/…` ([[Installation]]). |
| `Could not find "no-such-rule" in plugin "ownership".` | The plugin has two rules: `one-component-per-file` and `no-external-styling`. |
| A parsing error on a `.tsx` file | The parser does not read JSX. For TypeScript, use `typescript-eslint` with `parserOptions: { ecmaFeatures: { jsx: true } }`. |
| The rule never reports | The rule is not on for that file: check `files` of the block that turns it on. With a flat config the last matching block wins. |
| ``@mrzr/eslint-plugin-component-ownership: no-external-styling option "visual" has an invalid regular expression "(" (…)`` | An entry of `visual` or `allow` does not compile as a JavaScript regular expression. |
| `Unexpected property "colour"` / `should be array` | ESLint's own check of the options. The valid ones are `visual`, `builtins`, `allow` and `descendants` ([[no-external-styling]]). |
| A class is reported that you want to keep | Add it to `allow` with `^…$`, or move it into the component's variants. |
| A class is not reported that you expected | It is not Tailwind, or the string is built by a call the rule cannot read. Add a pattern with `visual` ([[FAQ]]). |
| A second component is not reported | It is a class, is declared inside a function, has no name, or is not PascalCase ([[one-component-per-file]]). |
| The first component is reported, not the second | The first one in the file is the allowed one. The rule counts in order of declaration. |
