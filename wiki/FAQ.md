# FAQ

---

### Why is `size-8` allowed but `p-4` not?

Sizing is part of how a component is placed in its caller's layout: `w-full`, `size-8`, `h-10`. Inner spacing, colour, type, borders, radius, shadows and motion change how the element looks, and that belongs to the component. The built-in list is in [[no-external-styling]].

### Does it work without Tailwind?

The rules read class names, and the `visual` list is made of Tailwind utility names. With another class system nothing matches, unless you add your own patterns with `visual` and `builtins: false`. `one-component-per-file` does not depend on Tailwind.

### How do I keep one class that is reported?

Put it in `allow`, anchored: `allow: ["^bg-primary$"]`. Or, better, move it into the component's variants, which is what the message asks for.

### Can I turn a rule on for new files only?

ESLint decides which files a rule applies to. Turn it on for the whole project as `"error"`, and add a later block that lists the files that already break it as `"warn"` ([[Quick-Start]]). Remove a file from that list when it is fixed.

### Why is the first component not reported?

A module is allowed one. The rule reports each component after the first, in order of declaration.

### Why is a class component not counted?

The rule looks for functions and arrow functions that contain JSX, and for `memo` and `forwardRef` around them. A class component is not read, and neither is a component declared inside another function.

### Does it fix anything?

No. Moving a component to its own file, or a class into a variant, is a decision for you.

### Why `@mrzr` and not a short name?

The plugin is published as `@mrzr/eslint-plugin-component-ownership`, so ESLint uses `@mrzr` as its default prefix. You can register it under any key.
