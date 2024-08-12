import { cosmiconfig } from "cosmiconfig";
import { findUp } from "find-up";
import path from "path";

export async function loadConfig() {
  const rootDir = await findUp("package.json", { cwd: process.cwd() });
  if (!rootDir) {
    throw new Error("Could not find the root directory.");
  }

  const rootPath = path.dirname(rootDir);

  const explorer = cosmiconfig("babel", {
    searchPlaces: [
      ".babelrc",
      ".babelrc.json",
      ".babelrc.js",
      "babel.config.js",
    ],
    stopDir: rootPath,
  });

  const result = await explorer.search(rootPath);
  if (result && result.config) {
    return result.config;
  } else {
    throw new Error("No configuration found.");
  }
}
