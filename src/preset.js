import { customPlugin, pipePlugin, observablePlugin } from "./plugin.js";

export function customPreset() {
  return {
    plugins: [observablePlugin, pipePlugin, customPlugin],
  };
}
