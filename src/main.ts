import { Arithmetiny, Context } from "./index";

const asFn = async () => {
  const ctx: Context = {
    vars: [{ name: "yeah", value: 420 }],
    functions: [
      { name: "square", fn: (a) => a * a },
      { name: "rand", fn: Math.random },
    ],
  };
  const parser = new Arithmetiny(ctx);
  await parser.evaluate("sin(1,2)");
};

asFn().then();
