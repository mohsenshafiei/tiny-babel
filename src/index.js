import parser from "@babel/parser"; // This parser works based on babylon parser

// lib
import { customPreset } from "./preset.js";
import { traverse } from "./traverse.js";
import { loadConfig } from "./config.js";
import { generateCode } from "./generator.js";
import { customSyntaxPlugin } from "./parser.js";

// code
import { newCode } from "./src.js";

async function applyPreset(ast, preset) {
  const { plugins } = preset();
  plugins.forEach((plugin) => {
    if (typeof plugin === "function") {
      const pluginObject = plugin();
      if (pluginObject && pluginObject.visitor) {
        traverse(ast, pluginObject.visitor);
      } else {
        console.warn("Plugin did not return a visitor object.");
      }
    } else if (plugin && plugin.visitor) {
      traverse(ast, plugin.visitor);
    } else {
      console.warn(
        "Invalid plugin structure. Expected a function or an object with a visitor."
      );
    }
  });
}

async function main() {
  try {
    const config = await loadConfig();

    const ast = parser.parse(newCode, {
      sourceType: "module",
      plugins: [["pipelineOperator", { proposal: "minimal" }]],
      tokens: true,
    });

    config.presets.forEach((presetName) => {
      const preset = presetName === "customPreset" ? customPreset : null;
      if (preset) {
        applyPreset(ast, preset);
      }
    });

    applyPreset(ast, customPreset);
    const transformedCode = generateCode(ast);

    console.log("Transformed Code:");
    console.log(transformedCode);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
