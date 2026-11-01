# no-external-styling

Visual utilities are reported outside the component that owns the look. A screen arranges components; painting them is the component's job.

```js
rules: { "ownership/no-external-styling": "error" }
```

Turn it on for the folders that use components, and leave it off for the one that defines them ([[Quick-Start]]).

---

## What is reported

Two kinds of class name, in the order the rule checks them:

| Message id | Reported when | Example |
|---|---|---|
| `descendant` | A variant reaches into the children of the element | `[&_svg]:size-4`, `*:p-2`, `**:data-[slot=chip]:w-auto` |
| `visual` | The utility changes how the element looks | `bg-card`, `text-primary`, `rounded-md`, `p-4`, `hover:shadow-lg` |

The messages:

```
`bg-card` styles an element from outside a component. Move it into the component's variants, or make the styled element a component.
`[&_svg]:size-4` reaches into a component's children. Add a variant to that component instead.
```

A `visual` class is found after its variants are removed (`hover:`, `md:`, `dark:`), after a leading `!` or `-`, so `hover:rounded-md`, `!bg-primary` and `-p-2` are reported.

## What is not reported

Placement and sizing inside the caller's own layout: `flex`, `grid`, `gap-3`, `w-full`, `size-8`, `min-w-0`, `flex-1`, `m-2`, `mt-4`, `relative`, `overflow-hidden`, `col-span-2`, `rotate-180`, `truncate`, and `text-center` (and the other text alignment and wrapping utilities).

## Where class names are read

In a JSX attribute or an object property whose name is `className`, or ends in `ClassName` with a lower-case word before it (`wrapperClassName`, `boxClassName`). Inside the value, strings are found in:

| Form | Example |
|---|---|
| A string | `className="bg-card p-4"` |
| A template literal, the fixed parts | `` className={`flex ${gap} bg-card`} `` |
| Arguments of a call | `className={cn("flex", active && "bg-primary")}` |
| A conditional | `className={on ? "shadow-md" : "ring-1"}` |
| An array | `className={["flex", { "rounded-lg": on }]}` |
| An object, keys and values | `{ "rounded-lg": on }` |

Other attributes are not read: `id="bg-primary"` and `title="text-sm"` are fine.

## The built-in list

A `visual` class is one whose utility, without variants, matches one of these regular expressions. The list is exported as `VISUAL_UTILITIES`:

<!-- verbatim: src/rules/no-external-styling.ts -->
```ts
export const VISUAL_UTILITIES: RegExp[] = [
  /^bg-/,
  /^from-|^via-|^to-/,
  /^text-(?!(start|end|center|left|right|justify|wrap|nowrap|balance|pretty|ellipsis|clip)$)/,
  /^font-/,
  /^leading-/,
  /^tracking-/,
  /^(italic|not-italic|uppercase|lowercase|capitalize|normal-case)$/,
  /^(underline|overline|line-through|no-underline)$/,
  /^decoration-/,
  /^(tabular|oldstyle|lining|proportional|diagonal|stacked)-nums$/,
  /^border/,
  /^divide-/,
  /^rounded/,
  /^shadow/,
  /^ring/,
  /^outline/,
  /^opacity-/,
  /^fill-/,
  /^stroke-/,
  /^placeholder-/,
  /^caret-/,
  /^accent-/,
  /^(p|px|py|ps|pe|pt|pb|pl|pr)-/,
  /^(transition|duration-|ease-|delay-|animate-)/,
  /^backdrop-/,
  /^(blur|brightness|contrast|grayscale|saturate|drop-shadow)/,
];
```

---

## Options

```js
"ownership/no-external-styling": ["error", { visual: ["^size-"], allow: ["^bg-primary$"], descendants: false }]
```

| Option | Type | Default | Meaning |
|---|---|---|---|
| `visual` | `string[]` | `[]` | More utilities that count as visual. Each is a regular expression tested against the utility without variants, `!` and a leading `-`. |
| `builtins` | `boolean` | `true` | `false` drops the built-in list, so only `visual` counts. |
| `allow` | `string[]` | `[]` | Class names to never report. Each is a regular expression tested against the **whole** class name, with its variants: `^hover:bg-primary$`. |
| `descendants` | `boolean` | `true` | `false` allows variants that reach into children. |

`allow` wins over everything: a class it matches is not reported, whether it is `visual` or `descendant`.

Examples, each checked by the test suite:

| Class | Options | Result |
|---|---|---|
| `size-4` | none | not reported |
| `size-4` | `visual: ["^size-"]` | `visual` |
| `bg-primary` | `builtins: false` | not reported |
| `size-4 bg-primary` | `builtins: false, visual: ["^size-"]` | `size-4` only |
| `bg-primary text-sm` | `allow: ["^bg-"]` | `text-sm` only |
| `hover:bg-primary` | `allow: ["^hover:bg-primary$"]` | not reported |
| `[&_svg]:size-4` | `descendants: false` | not reported |

An unknown option, or a value of the wrong type, is rejected by ESLint. A regular expression that does not compile stops the run: `@mrzr/eslint-plugin-component-ownership: no-external-styling option "visual" has an invalid regular expression "(" (…)`.
