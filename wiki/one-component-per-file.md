# one-component-per-file

A module defines one component. The second and later ones are reported, each at its name.

```js
rules: { "ownership/one-component-per-file": "error" }
```

The rule has no options.

---

## What counts as a component

A declaration at the **top level of the module**, exported or not, whose name starts with a capital letter and which contains JSX:

| Declaration | Counts |
|---|---|
| `function Card() { return <div />; }` | yes |
| `export default function Card() { return <div />; }` | yes |
| `const Card = () => <div />;` | yes |
| `const Card = function () { return <div />; };` | yes |
| `const Card = memo(() => <div />);` | yes, also `React.memo` |
| `const Card = React.forwardRef((props, ref) => <div ref={ref} />);` | yes, also `forwardRef` |

These are **not** counted:

| Declaration | Why |
|---|---|
| `function helper() { return 1; }` and `const CONFIG = {}` | No JSX |
| `const lower = () => <div />;` | The name is not PascalCase |
| `const Card = () => { const Inner = () => <i />; return <Inner />; };` | `Inner` is not at the top level |
| `class Legacy extends Base { render() { return <b />; } }` | Class components are not read |
| `export default () => <div />;` and `export default memo(() => <div />);` | They have no name |

The first component of the file is never reported, whichever it is.

## The message

```
`Profile` is a second component in this file. Move it into its own file (one component per file).
```

The report is on the identifier of the extra component, so a line and column point at its name. The message id is `extra`.

## When it fires

```js
function Row() { return <li />; }
export function List() { return <ul><Row /></ul>; }
```

reports `List`, because `Row` came first. The order in the file decides, not which one is exported. To make `Row` the one to move, declare it after `List`, or, better, put it in its own file.

A file with three components reports the second and the third.
