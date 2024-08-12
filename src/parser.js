import { types as tt } from "@babel/core";

export function customSyntaxPlugin({ types: t }) {
  return {
    parserOverride(code, parser) {
      console.log(tt);

      parser.tokenizer.extend("readToken", (inner) => {
        return function (code) {
          if (this.state.pos < this.input.length) {
            if (
              this.state.pos + 2 < this.input.length &&
              this.input.slice(this.state.pos, this.state.pos + 2) === "@="
            ) {
              this.state.pos += 2;
              return this.finishToken(tt.assign, "@=");
            }
          }
          return inner.call(this, code);
        };
      });

      parser.extend("parseExprAtom", (inner) => {
        return function () {
          const expr = inner.call(this);
          if (this.match(tt.assign) && this.state.value === "@=") {
            this.next();
            const right = this.parseMaybeAssign();
            return t.assignmentExpression("@=", expr, right);
          }
          return expr;
        };
      });

      return parser.parse(code);
    },
  };
}
