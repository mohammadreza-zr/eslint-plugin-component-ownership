import type { Rule } from "eslint";
import type { AstNode } from "../ast.js";

/*
 * Utilities that change how an element *looks*: colour, type, border, radius,
 * shadow, inner spacing, motion. Placement and sizing inside the caller's own
 * layout (flex/grid, width/height, margin, position, overflow) stay allowed:
 * arranging components is the caller's job, painting them is the component's.
 */
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

const DESCENDANT_VARIANT = /(^|:)(\[&|\*{1,2}$|\*{1,2}:)/;
const CLASS_NAME_KEY = /^(className|[a-z][A-Za-z]*ClassName)$/;

function splitVariants(token: string): { variants: string; utility: string } {
  let depth = 0;
  let cut = -1;
  for (let index = 0; index < token.length; index += 1) {
    const char = token[index];
    if (char === "[" || char === "(") depth += 1;
    else if (char === "]" || char === ")") depth -= 1;
    else if (char === ":" && depth === 0) cut = index;
  }
  return cut === -1
    ? { variants: "", utility: token }
    : { variants: token.slice(0, cut + 1), utility: token.slice(cut + 1) };
}

/** Every static class string inside an attribute or property value. */
function classStrings(node: AstNode, out: { node: AstNode; text: string }[] = []) {
  if (!node) return out;
  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") out.push({ node, text: node.value });
      break;
    case "TemplateLiteral":
      for (const quasi of node.quasis) out.push({ node: quasi, text: quasi.value.cooked ?? "" });
      for (const expression of node.expressions) classStrings(expression, out);
      break;
    case "JSXExpressionContainer":
      classStrings(node.expression, out);
      break;
    case "CallExpression":
      for (const arg of node.arguments) classStrings(arg, out);
      break;
    case "ConditionalExpression":
      classStrings(node.consequent, out);
      classStrings(node.alternate, out);
      break;
    case "LogicalExpression":
      classStrings(node.right, out);
      classStrings(node.left, out);
      break;
    case "ArrayExpression":
      for (const element of node.elements) classStrings(element, out);
      break;
    case "ObjectExpression":
      for (const property of node.properties) {
        if (property.type === "Property") {
          if (property.key.type === "Literal") classStrings(property.key, out);
          classStrings(property.value, out);
        }
      }
      break;
    default:
      break;
  }
  return out;
}

export interface NoExternalStylingOptions {
  /** More utilities that count as visual, as regular expressions tested against the utility without its variants. */
  visual?: string[];
  /** `false` drops the built-in list, so only `visual` counts. Default `true`. */
  builtins?: boolean;
  /** Whole class names to never report, as regular expressions. */
  allow?: string[];
  /** `false` allows variants that reach into children (`[&_svg]:`, `*:`). Default `true`. */
  descendants?: boolean;
}

function compile(option: string, sources: string[] | undefined): RegExp[] {
  return (sources ?? []).map((source) => {
    try {
      return new RegExp(source);
    } catch (error) {
      throw new Error(
        `@mrzr/eslint-plugin-component-ownership: no-external-styling option "${option}" has an invalid regular expression ${JSON.stringify(source)} (${(error as Error).message})`,
      );
    }
  });
}

export const noExternalStyling: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Forbid visual utilities outside the component that owns the look: styling belongs in a component or its variants.",
      url: "https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/no-external-styling",
    },
    messages: {
      visual:
        "`{{token}}` styles an element from outside a component. Move it into the component's variants, or make the styled element a component.",
      descendant: "`{{token}}` reaches into a component's children. Add a variant to that component instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          visual: { type: "array", items: { type: "string" } },
          builtins: { type: "boolean" },
          allow: { type: "array", items: { type: "string" } },
          descendants: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = (context.options[0] ?? {}) as NoExternalStylingOptions;
    const visual = [...(options.builtins === false ? [] : VISUAL_UTILITIES), ...compile("visual", options.visual)];
    const allow = compile("allow", options.allow);
    const descendants = options.descendants !== false;

    function violationOf(token: string): "visual" | "descendant" | undefined {
      if (allow.some((pattern) => pattern.test(token))) return undefined;
      const { variants, utility } = splitVariants(token);
      if (descendants && variants && DESCENDANT_VARIANT.test(variants)) return "descendant";
      const bare = utility.replace(/^!|!$/g, "").replace(/^-/, "");
      return visual.some((pattern) => pattern.test(bare)) ? "visual" : undefined;
    }

    function check(valueNode: AstNode) {
      for (const { node, text } of classStrings(valueNode)) {
        for (const token of text.split(/\s+/).filter(Boolean)) {
          const violation = violationOf(token);
          if (violation) context.report({ node, messageId: violation, data: { token } });
        }
      }
    }

    return {
      JSXAttribute(attribute: AstNode) {
        if (attribute.name.type === "JSXIdentifier" && CLASS_NAME_KEY.test(attribute.name.name)) {
          check(attribute.value);
        }
      },
      Property(property: AstNode) {
        const key = property.key.type === "Identifier" ? property.key.name : property.key.value;
        if (typeof key === "string" && CLASS_NAME_KEY.test(key)) check(property.value);
      },
    };
  },
};
