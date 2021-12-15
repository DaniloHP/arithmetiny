import { Arithmetiny, Context } from "../src/";
import {} from "colors"; //necessary

const ctx: Context = {
  functions: [
    { name: "round", fn: Math.round },
    { name: "rand", fn: Math.random },
    { name: "floor", fn: Math.floor },
  ],
  vars: [{ name: "aVar", value: 100 }],
};
const TEST_PARSER = new Arithmetiny(ctx);
const BENCH_REPS = 100;

test("Benchmarks", async () => {
  await evalBenchmark(
    "48 * 2 ^ floor(rand() * round(10 * sin((2.5e5^sqrt(12 % 3.1) - 740833242.7245028) / 256) ^ (1/2)))"
  );
  await evalBenchmark("-------------------1");
  await evalBenchmark(
    "((((((((((((((((((((((((((((((((((((((((((((((((1))))))))))))))))))))))))))))))))))))))))))))))))"
  );
  await evalBenchmark("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1");
  await constructorBenchmark();
  await constructorBenchmark(ctx);
  const fresh = new Arithmetiny();
  const avgUs = await bench(() => fresh.setContext(ctx));
  process.stdout.write(
    `${avgUs.toString().inverse.bold} useconds to set context\n\n`
  );
});

test("Good expressions", async () => {
  expect(await evalBenchmark("1e10")).toBe(1e10);
  expect(await evalBenchmark("1e-10")).toBe(1e-10);
  expect(await evalBenchmark("1+2")).toBe(3);
  expect(await evalBenchmark("1.0 + 2.0")).toBe(3);
  expect(await evalBenchmark("2^10")).toBe(1024);
  expect(await evalBenchmark("1+6*110/10")).toBe(67);
  expect(await evalBenchmark("-1")).toBe(-1);
  expect(await evalBenchmark("-(1)")).toBe(-1);
  expect(await evalBenchmark("2^-1")).toBe(0.5);
  expect(await evalBenchmark("2.0 ^ 2 ^ 2 ^ 2")).toBe(65536);
  expect(await evalBenchmark("1/2/3/4")).toBeCloseTo(1 / 2 / 3 / 4);
  expect(await evalBenchmark("2^(5+15)")).toBe(1048576);
  expect(await evalBenchmark("e")).toBe(Math.E);
  expect(await evalBenchmark("aVar")).toBe(ctx.vars[0].value);
  expect(await evalBenchmark("2*e")).toBeCloseTo(2 * Math.E);
  expect(await evalBenchmark("ln(e)")).toBe(1);
  expect(await evalBenchmark("sin(pi)")).toBeCloseTo(0);
  expect(await evalBenchmark("cos(pi)")).toBe(-1);
  expect(await evalBenchmark("cos(2 * pi)")).toBe(1);
  expect(await evalBenchmark("sin(1)^2 + cos(1)^2")).toBeCloseTo(1);
  expect(await evalBenchmark("sin(sin(pi))")).toBeCloseTo(0);
  expect(await evalBenchmark("   sin(  sin(  pi   )   )   ")).toBeCloseTo(0);
  expect(await evalBenchmark("1 - sqrt(4)")).toBeCloseTo(-1);
  expect(await evalBenchmark("1 -      sqrt( 4   )  ")).toBeCloseTo(-1);
  expect(await evalBenchmark("abs(0 - sqrt(4))")).toBeCloseTo(2);
  expect(await evalBenchmark("-sqrt(4)")).toBeCloseTo(-2);
  const r = await evalBenchmark("10 * rand()");
  expect(r).toBeLessThan(10);
  expect(r).toBeGreaterThanOrEqual(0);
  expect(await evalBenchmark("floor(rand())")).toBe(0);
  expect(await evalBenchmark("floor(rand()) * 1e100")).toBe(0);
  const newCtx: Context = {
    vars: [
      { name: "x", value: 10 },
      { name: "e", value: 3 },
      { name: "pi", value: 3 },
    ],
    functions: [{ name: "sin", fn: () => Math.PI }],
  };
  TEST_PARSER.setContext(newCtx);
  //want user to be able to overwrite builtin functions and variables
  expect(await evalBenchmark("e + pi")).toBe(6);
  expect(await evalBenchmark("sin()")).toBe(Math.PI);
  await expect(
    async () => await TEST_PARSER.evaluate("sin(pi)")
  ).rejects.toThrow("argument");
});

test("Bad expressions", async () => {
  expect(await evalBenchmark("--1")).toBe(NaN);
  expect(await evalBenchmark("---1")).toBe(NaN);
  expect(await evalBenchmark("1+2+")).toBe(NaN);
  expect(await evalBenchmark("^1")).toBe(NaN);
  expect(await evalBenchmark("1^")).toBe(NaN);
  expect(await evalBenchmark("1^(3+4")).toBe(NaN);
  await expect(async () => {
    await TEST_PARSER.evaluate("sin(1,2)");
  }).rejects.toThrow();
  await expect(async () => {
    await TEST_PARSER.evaluate("varDoesntExist");
  }).rejects.toThrow();
  await expect(async () => {
    new Arithmetiny({ vars: [{ name: "bad-name", value: 0 }] });
  }).rejects.toThrow();
  await expect(async () => {
    new Arithmetiny({ functions: [{ name: "bad-name", fn: () => 0 }] });
  }).rejects.toThrow();
  await expect(async () => {
    new Arithmetiny({
      functions: [{ name: "1badName", fn: () => 0 }],
      vars: [{ name: "2badName", value: 0 }],
    });
  }).rejects.toThrow();
});

const constructorBenchmark = async (arg?: Context) => {
  const avgUs = await bench(() => {
    new Arithmetiny(arg);
  });
  const usStr = ` ${avgUs} `.inverse.bold;
  process.stdout.write(
    `${usStr} useconds to construct a parser with${arg ? "" : "out"} args.\n\n`
  );
};

const evalBenchmark = async (
  toEval: string,
  parser: Arithmetiny = TEST_PARSER
): Promise<number> => {
  const res = await parser.evaluate(toEval);
  const avgUs = await bench(async () => {
    await parser.evaluate(toEval);
  });
  const usStr = ` ${avgUs} `.inverse.bold;
  process.stdout.write(
    `${usStr} useconds to evaluate ${`${toEval} = ${res}`.bold}\n\n`
  );
  return res;
};

const bench = async (
  fn: (...args: any[]) => any,
  args: any[] = [],
  runs: number = BENCH_REPS
): Promise<number> => {
  let totalUs = 0;
  for (let i = 0; i < runs; i++) {
    const start = process.hrtime.bigint();
    await fn(...args);
    const deltaUs = (process.hrtime.bigint() - start) / BigInt(1000);
    totalUs += Number(deltaUs);
  }
  return Math.round(totalUs / runs);
};

test("Benchmarks", async () => {});
