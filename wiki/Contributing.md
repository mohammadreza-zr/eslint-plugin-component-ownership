# Contributing

```bash
git clone https://github.com/mohammadreza-zr/eslint-plugin-component-ownership.git
cd eslint-plugin-component-ownership
npm install
npm test     # builds, then runs every test
```

---

## Layout

```
src/
  index.ts                         the plugin: its name, its version and its rules
  ast.ts                           the loose node type the rules read
  rules/one-component-per-file.ts  the rule
  rules/no-external-styling.ts     the rule, its options and the built-in list
examples/
  basic/        a small project with an ESLint config and the exact output
test/
  rules.test.mjs   each rule with ESLint's RuleTester and the real TypeScript parser
  plugin.test.mjs  the plugin loaded in a real flat config, and the options
  example.test.mjs the example project, run with the real eslint command
  docs.test.mjs    checks the docs against the real files
wiki/              these pages
```

## Rules

- **A change to a rule needs a valid and an invalid case** in `rules.test.mjs`, with a real line of code.
- **No project names in `src/`.** A policy of one project is an option.
- **Tests use real ESLint and the real parser.** No mocks, stubs or fake timers.
- **Docs are checked.** A code block directly under `<!-- verbatim: path -->` must consist of lines of that file, in order, and every wiki link written in double square brackets must point at a page. `npm test` fails when they do not.
- **A change to behaviour needs the wiki and `CHANGELOG.md` updated.**

## Releasing

1. Update `CHANGELOG.md`.
2. `npm version patch` (or `minor`, `major`) and `git push --follow-tags`.
3. The `release` workflow checks that the tag equals the version in `package.json`, runs the typecheck and the tests on Node 20, 22 and 24, checks the type resolution, publishes to npm with provenance (trusted publishing, no token) and creates the GitHub release.

The first version of a new package has to be published by hand (`npm publish --access public`), because trusted publishing is set up on a package that exists. Then set it on npmjs.com: Settings → Trusted Publisher → GitHub Actions, user `mohammadreza-zr`, repository `eslint-plugin`, workflow `release.yml`, with direct `npm publish` allowed.

## The wiki

`wiki/` is the source. Publish it to the GitHub Wiki with:

```bash
npm run docs:sync
```

GitHub creates the wiki repository only once a first page exists. Enable it in the repository settings (Features → Wikis) and create any page in the browser, then run the command; it replaces the pages.
