import { declare } from "@babel/helper-plugin-utils";

const customSyntaxPlugin = declare((api, options) => {
  api.assertVersion(7);

  return {
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("customSyntax");
    },
  };
});

export default customSyntaxPlugin;
