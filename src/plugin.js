import * as t from "@babel/types";

export const customPlugin = {
  visitor: {
    Identifier(node) {
      if (node.name === "x") {
        node.name = "y";
      }
    },
    NumericLiteral(node) {
      if (node.value === 5) {
        node.value = 10;
      }
    },
  },
};

export const pipePlugin = {
  visitor: {
    BinaryExpression(node, parent, key) {
      if (!node || node.operator !== "|>") return;
      const left = node.left;
      const right = node.right;
      let newNode;
      if (t.isCallExpression(right)) {
        right.arguments.unshift(left);
        newNode = right;
      } else {
        newNode = t.callExpression(right, [left]);
      }

      parent[key] = newNode;
    },
  },
};

export const observablePlugin = {
  visitor: {
    AssignmentExpression(path) {
      if (path.node.operator === "@=") {
        path.replaceWith(
          t.callExpression(t.identifier("makeObservable"), [
            path.node.left,
            path.node.right,
          ])
        );
      }
    },
  },
};
