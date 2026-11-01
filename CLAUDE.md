# CLAUDE.md

## Rule: no project names

Nothing project-specific (a folder, a design-system policy) is written in `src/`. A policy is an option of a rule.

## Rule: each rule is tested both ways

A change to a rule needs a valid and an invalid case in `test/rules.test.mjs`, with a real line of code, run by ESLint's `RuleTester` with the real TypeScript parser.

## Rule: the output must not change by accident

The rules were extracted from a real project and give the same messages there as the code they came from. Compare the lint output of a real project before and after a change to a rule.

## Tests

Real ESLint, the real parser, the real `eslint` command on `examples/basic`. No mocks. `npm test` builds and runs `node --test`.
