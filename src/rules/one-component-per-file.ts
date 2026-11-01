import type { Rule } from "eslint";
import type { AstNode } from "../ast.js";

const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;
const COMPONENT_WRAPPERS = new Set(["memo", "forwardRef"]);

function containsJsx(node: AstNode): boolean {
  if (!node || typeof node.type !== "string") return false;
  if (node.type === "JSXElement" || node.type === "JSXFragment") return true;
  for (const key of Object.keys(node)) {
    if (key === "parent") continue;
    const value = node[key];
    if (Array.isArray(value)) {
      if (value.some(containsJsx)) return true;
    } else if (value && typeof value.type === "string" && containsJsx(value)) {
      return true;
    }
  }
  return false;
}

function isFunction(node: AstNode): boolean {
  return node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression";
}

function wrapperName(callee: AstNode): string | undefined {
  if (callee.type === "Identifier") return callee.name;
  if (callee.type === "MemberExpression" && !callee.computed) return callee.property.name;
  return undefined;
}

/** The components a module-level statement defines. */
function componentsOf(statement: AstNode): AstNode[] {
  const declaration =
    statement.type === "ExportNamedDeclaration" || statement.type === "ExportDefaultDeclaration"
      ? statement.declaration
      : statement;
  if (!declaration) return [];

  if (declaration.type === "FunctionDeclaration") {
    return declaration.id && PASCAL_CASE.test(declaration.id.name) && containsJsx(declaration.body)
      ? [declaration.id]
      : [];
  }

  if (declaration.type !== "VariableDeclaration") return [];
  return declaration.declarations
    .filter((declarator: AstNode) => {
      if (declarator.id.type !== "Identifier") return false;
      if (!PASCAL_CASE.test(declarator.id.name)) return false;
      const init = declarator.init;
      if (isFunction(init)) return containsJsx(init.body);
      if (init?.type === "CallExpression") {
        return (
          COMPONENT_WRAPPERS.has(wrapperName(init.callee) ?? "") &&
          init.arguments.some((arg: AstNode) => isFunction(arg) && containsJsx(arg))
        );
      }
      return false;
    })
    .map((declarator: AstNode) => declarator.id);
}

export const oneComponentPerFile: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Allow a single React component per module.",
      url: "https://github.com/mohammadreza-zr/eslint-plugin-component-ownership/wiki/one-component-per-file",
    },
    messages: {
      extra: "`{{name}}` is a second component in this file. Move it into its own file (one component per file).",
    },
    schema: [],
  },
  create(context) {
    return {
      Program(program: AstNode) {
        const components = program.body.flatMap(componentsOf);
        for (const id of components.slice(1)) {
          context.report({ node: id, messageId: "extra", data: { name: id.name } });
        }
      },
    };
  },
};
