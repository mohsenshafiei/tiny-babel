export function generateCode(node) {
  switch (node.type) {
    case "File":
      return generateCode(node.program);
    case "Program":
      return node.body.map(generateCode).join("\n");
    case "VariableDeclaration":
      return `${node.kind} ${node.declarations.map(generateCode).join(", ")};`;
    case "VariableDeclarator":
      return `${generateCode(node.id)} = ${generateCode(node.init)}`;
    case "Identifier":
      return node.name;
    case "NumericLiteral":
      return node.value;
    case "StringLiteral":
      return `"${node.value}"`;
    case "BinaryExpression":
      return `${generateCode(node.left)} ${node.operator} ${generateCode(
        node.right
      )}`;
    case "ExpressionStatement":
      return `${generateCode(node.expression)};`;
    case "CallExpression":
      const callee = generateCode(node.callee);
      const args = node.arguments.map(generateCode).join(", ");
      return `${callee}(${args})`;
    default:
      throw new Error(`Unhandled node type: ${node.type}`);
  }
}
