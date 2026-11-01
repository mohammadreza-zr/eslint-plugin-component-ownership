import { describe, it } from "node:test";
import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";

import plugin from "../dist/index.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("one-component-per-file", plugin.rules["one-component-per-file"], {
  valid: [
    "export function Card() { return <div />; }",
    "function helper() { return 1; } export function Card() { return <div />; }",
    "const CONFIG = { a: 1 }; export const Card = () => <div />;",
    "export default function Card() { return <div />; }",
    "export const Card = memo(() => <div />);",
    "export const Card = React.forwardRef((props, ref) => <div ref={ref} />);",
    "export function Card() { return <div />; } export const label = 'x'; export type Props = {};",
    "const lower = () => <div />; export function Card() { return <div />; }",
    "export const Card = () => { const Inner = () => <i />; return <Inner />; };",
    "export const makeThing = () => 1; export const Card = () => <div />;",
    "export function Card() { return <div />; } export const helper = memo(() => 1);",
    "export function Card() { return <div />; } class Legacy extends Base { render() { return <b />; } }",
    "export const A = () => <a />; export default () => <b />;",
    "export const A = () => <a />; export default memo(() => <b />);",
  ],
  invalid: [
    {
      code: "function Row() { return <li />; } export function List() { return <ul><Row /></ul>; }",
      errors: [{ messageId: "extra", data: { name: "List" } }],
    },
    {
      code: "export const A = () => <a />; export const B = memo(() => <b />);",
      errors: [{ messageId: "extra", data: { name: "B" } }],
    },
    {
      code: "export const A = () => <a />; export const B = React.forwardRef((p, r) => <b ref={r} />); export function C() { return <>x</>; }",
      errors: [{ messageId: "extra", data: { name: "B" } }, { messageId: "extra", data: { name: "C" } }],
    },
    {
      code: "export default function A() { return <a />; } export function B() { return <b />; }",
      errors: [{ messageId: "extra", data: { name: "B" } }],
    },
    {
      code: "const A = function () { return <a />; }; const B = function () { return <b />; };",
      errors: [{ messageId: "extra", data: { name: "B" } }],
    },
  ],
});

const noExternalStyling = plugin.rules["no-external-styling"];

ruleTester.run("no-external-styling", noExternalStyling, {
  valid: [
    '<div className="flex min-w-0 flex-1 gap-3" />',
    '<Button className="w-full sm:col-span-2 ltr:rotate-180" />',
    '<p className="text-center truncate" />',
    'const field = { className: "min-w-28 flex-[179_1_0%]" };',
    '<div className="m-2 mt-4 h-10 w-10 relative overflow-hidden" />',
    '<div id="bg-primary" title="text-sm" />',
    '<div className={`flex ${gap}`} />',
    { code: '<div className="bg-primary" />', options: [{ allow: ["^bg-primary$"] }] },
    { code: '<div className="hover:bg-primary" />', options: [{ allow: ["^hover:bg-primary$"] }] },
    { code: '<div className="[&_svg]:size-4" />', options: [{ descendants: false }] },
    { code: '<div className="bg-primary" />', options: [{ builtins: false }] },
    { code: '<div className="size-4" />' },
  ],
  invalid: [
    {
      code: '<p className="text-sm text-destructive" />',
      errors: [{ messageId: "visual" }, { messageId: "visual" }],
    },
    {
      code: '<div className={cn("flex", active && "bg-primary")} />',
      errors: [{ messageId: "visual", data: { token: "bg-primary" } }],
    },
    {
      code: '<Box wrapperClassName="hover:rounded-md p-4" />',
      errors: [{ messageId: "visual" }, { messageId: "visual" }],
    },
    {
      code: '<Seg className="[&_[data-slot=item]]:px-1" />',
      errors: [{ messageId: "descendant" }],
    },
    {
      code: 'const field = { boxClassName: "**:data-[slot=chip]:w-auto" };',
      errors: [{ messageId: "descendant" }],
    },
    {
      code: '<div className="!bg-primary -mt-2 -p-2 border-b" />',
      errors: [{ messageId: "visual", data: { token: "!bg-primary" } }, { messageId: "visual", data: { token: "-p-2" } }, { messageId: "visual", data: { token: "border-b" } }],
    },
    {
      code: '<div className={`flex ${gap} bg-card`} />',
      errors: [{ messageId: "visual", data: { token: "bg-card" } }],
    },
    {
      code: '<div className={["flex", { "rounded-lg": on }]} />',
      errors: [{ messageId: "visual", data: { token: "rounded-lg" } }],
    },
    {
      code: '<div className={on ? "shadow-md" : "ring-1"} />',
      errors: [{ messageId: "visual", data: { token: "shadow-md" } }, { messageId: "visual", data: { token: "ring-1" } }],
    },
    {
      code: '<div className="size-4" />',
      options: [{ visual: ["^size-"] }],
      errors: [{ messageId: "visual", data: { token: "size-4" } }],
    },
    {
      code: '<div className="size-4 bg-primary" />',
      options: [{ builtins: false, visual: ["^size-"] }],
      errors: [{ messageId: "visual", data: { token: "size-4" } }],
    },
    {
      code: '<div className="bg-primary text-sm" />',
      options: [{ allow: ["^bg-"] }],
      errors: [{ messageId: "visual", data: { token: "text-sm" } }],
    },
  ],
});
