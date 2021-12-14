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
const arith = new Arithmetiny(ctx);

test("Benchmarks", async () => {
  expect(
    await evalWithHrTime(
      "48 * 2 ^ floor(rand() * round(10 * sin((2.5e5^sqrt(12 % 3.1) - 740833242.7245028) / 256) ^ (1/2)))"
    )
  );
  expect(await evalWithHrTime("-------------------1"));
  expect(
    await evalWithHrTime(
      "((((((((((((((((((((((((((((((((((((((((((((((((1))))))))))))))))))))))))))))))))))))))))))))))))"
    )
  );
  expect(await evalWithHrTime("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1"));
});

test("Good expressions", async () => {
  expect(await evalWithHrTime("1e10")).toBe(1e10);
  expect(await evalWithHrTime("1e-10")).toBe(1e-10);
  expect(await evalWithHrTime("1+2")).toBe(3);
  expect(await evalWithHrTime("1.0 + 2.0")).toBe(3);
  expect(await evalWithHrTime("2^10")).toBe(1024);
  expect(await evalWithHrTime("1+6*110/10")).toBe(67);
  expect(await evalWithHrTime("-1")).toBe(-1);
  expect(await evalWithHrTime("-(1)")).toBe(-1);
  expect(await evalWithHrTime("2^-1")).toBe(0.5);
  expect(await evalWithHrTime("2.0 ^ 2 ^ 2 ^ 2")).toBe(65536);
  expect(await evalWithHrTime("1/2/3/4")).toBeCloseTo(1 / 2 / 3 / 4);
  expect(await evalWithHrTime("2^(5+15)")).toBe(1048576);
  expect(await evalWithHrTime("e")).toBe(Math.E);
  expect(await evalWithHrTime("2*e")).toBeCloseTo(2 * Math.E);
  expect(await evalWithHrTime("ln(e)")).toBe(1);
  expect(await evalWithHrTime("sin(pi)")).toBeCloseTo(0);
  expect(await evalWithHrTime("cos(pi)")).toBe(-1);
  expect(await evalWithHrTime("cos(2 * pi)")).toBe(1);
  expect(await evalWithHrTime("sin(1)^2 + cos(1)^2")).toBeCloseTo(1);
  expect(await evalWithHrTime("sin(sin(pi))")).toBeCloseTo(0);
  expect(await evalWithHrTime("   sin(  sin(  pi   )   )   ")).toBeCloseTo(0);
  expect(await evalWithHrTime("1 - sqrt(4)")).toBeCloseTo(-1);
  expect(await evalWithHrTime("1 -      sqrt( 4   )  ")).toBeCloseTo(-1);
  expect(await evalWithHrTime("abs(0 - sqrt(4))")).toBeCloseTo(2);
  expect(await evalWithHrTime("-sqrt(4)")).toBeCloseTo(-2);
  const r = await evalWithHrTime("10 * rand()");
  expect(r).toBeLessThan(10);
  expect(r).toBeGreaterThanOrEqual(0);
  expect(await evalWithHrTime("floor(rand())")).toBe(0);
  expect(await evalWithHrTime("floor(rand()) * 1e100")).toBe(0);
});

test("Bad expressions", async () => {
  expect(await evalWithHrTime("--1")).toBe(NaN);
  expect(await evalWithHrTime("---1")).toBe(NaN);
  expect(await evalWithHrTime("1e -10")).toBe(NaN);
  expect(await evalWithHrTime("1+2+")).toBe(NaN);
  expect(await evalWithHrTime("^1")).toBe(NaN);
  expect(await evalWithHrTime("1^")).toBe(NaN);
  expect(await evalWithHrTime("1^(3+4")).toBe(NaN);
  await expect(async () => {
    await arith.evaluate("sin(1,2)");
  }).rejects.toThrow();
  await expect(async () => {
    await arith.evaluate("varDoesntExist");
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

const evalWithHrTime = async (toEval: string): Promise<number> => {
  const res = await arith.evaluate(toEval);
  let totalUs = 0;
  const runs = 10;
  for (let i = 0; i < runs; i++) {
    const start = process.hrtime.bigint();
    await arith.evaluate(toEval);
    const deltaUs = (process.hrtime.bigint() - start) / BigInt(1000);
    totalUs += Number(deltaUs);
  }
  const usStr = ` ${Math.round(totalUs / runs)} `.inverse.bold;
  process.stdout.write(
    `${usStr} useconds to evaluate ${`${toEval} = ${res}`.bold}\n\n`
  );
  return res;
};

test("Benchmarks", async () => {});
