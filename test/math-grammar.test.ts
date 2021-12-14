import { Arithmetiny, Context } from "../src/";

const ctx: Context = {
  functions: [
    { name: "round", fn: Math.round },
    { name: "rand", fn: Math.random },
    { name: "floor", fn: Math.floor },
  ],
  vars: [{ name: "aVar", value: 100 }],
};
const arith = new Arithmetiny(ctx);
test("Good expressions", async () => {
  expect(await arith.evaluate("1e10")).toBe(1e10);
  expect(await arith.evaluate("1e-10")).toBe(1e-10);
  expect(await arith.evaluate("1+2")).toBe(3);
  expect(await arith.evaluate("1.0 + 2.0")).toBe(3);
  expect(await arith.evaluate("2^10")).toBe(1024);
  expect(await arith.evaluate("1+6*110/10")).toBe(67);
  expect(await arith.evaluate("-1")).toBe(-1);
  expect(await arith.evaluate("-(1)")).toBe(-1);
  expect(await arith.evaluate("2^-1")).toBe(0.5);
  expect(await arith.evaluate("2.0 ^ 2 ^ 2 ^ 2")).toBe(65536);
  expect(await arith.evaluate("1/2/3/4")).toBeCloseTo(1 / 2 / 3 / 4);
  expect(await arith.evaluate("2^(5+15)")).toBe(1048576);
  expect(await arith.evaluate("e")).toBe(Math.E);
  expect(await arith.evaluate("2*e")).toBeCloseTo(2 * Math.E);
  expect(await arith.evaluate("ln(e)")).toBe(1);
  expect(await arith.evaluate("sin(pi)")).toBeCloseTo(0);
  expect(await arith.evaluate("cos(pi)")).toBe(-1);
  expect(await arith.evaluate("cos(2 * pi)")).toBe(1);
  expect(await arith.evaluate("sin(1)^2 + cos(1)^2")).toBeCloseTo(1);
  expect(await arith.evaluate("sin(sin(pi))")).toBeCloseTo(0);
  expect(await arith.evaluate("   sin(  sin(  pi   )   )   ")).toBeCloseTo(0);
  expect(await arith.evaluate("1 - sqrt(4)")).toBeCloseTo(-1);
  expect(await arith.evaluate("1 -      sqrt( 4   )  ")).toBeCloseTo(-1);
  expect(await arith.evaluate("abs(0 - sqrt(4))")).toBeCloseTo(2);
  expect(await arith.evaluate("-sqrt(4)")).toBeCloseTo(-2);
  const r = await arith.evaluate("10 * rand()");
  expect(r).toBeLessThan(10);
  expect(r).toBeGreaterThanOrEqual(0);
  expect(await arith.evaluate("floor(rand())")).toBe(0);
  expect(await arith.evaluate("floor(rand()) * 1e100")).toBe(0);
});

test("Bad expressions", async () => {
  expect(await arith.evaluate("1e -10")).toBe(NaN);
  expect(await arith.evaluate("1+2+")).toBe(NaN);
  expect(await arith.evaluate("^1")).toBe(NaN);
  expect(await arith.evaluate("1^")).toBe(NaN);
  expect(await arith.evaluate("1^(3+4")).toBe(NaN);
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
