export function traverse(node, visitors, parent = null, key = null) {
  if (!node || typeof node !== "object") return;

  const visitor = visitors[node.type];
  if (visitor) {
    visitor(node, parent, key);
  }

  Object.keys(node).forEach((key) => {
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((c, idx) => traverse(c, visitors, node[key], idx));
    } else if (typeof child === "object" && child !== null) {
      traverse(child, visitors, node, key);
    }
  });
}
