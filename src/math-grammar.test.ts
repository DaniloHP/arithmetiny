import { MathGrammar } from "./math-grammar";

const grammar = new MathGrammar();
test("Good expressions", () => {
  expect(grammar.evaluate("1+2")).toBe(3);
  expect(grammar.evaluate("2^10")).toBe(1024);
  expect(grammar.evaluate("1+6*110/10")).toBe(67);
  expect(grammar.evaluate("-1")).toBe(-1);
  expect(grammar.evaluate("-(1)")).toBe(-1);
  expect(grammar.evaluate("2^-1")).toBe(0.5);
  expect(grammar.evaluate("2 ^ 2 ^ 2 ^ 2")).toBe(65536);
  expect(grammar.evaluate("1/2/3/4")).toBeCloseTo(1 / 2 / 3 / 4);
  expect(grammar.evaluate("2^(5+15)")).toBe(1048576);
  expect(grammar.evaluate("e")).toBe(Math.E);
  expect(grammar.evaluate("2*e")).toBeCloseTo(2 * Math.E);
  expect(grammar.evaluate("ln(e)")).toBe(1);
  expect(grammar.evaluate("sin(pi)")).toBeCloseTo(0);
  expect(grammar.evaluate("cos(pi)")).toBe(-1);
  expect(grammar.evaluate("cos(2 * pi)")).toBe(1);
  expect(grammar.evaluate("sin(1)^2 + cos(1)^2")).toBeCloseTo(1);
  expect(grammar.evaluate("sin(sin(pi))")).toBeCloseTo(0);
  expect(grammar.evaluate("1 - sqrt(4)")).toBeCloseTo(-1);
  expect(grammar.evaluate("abs(0 - sqrt(4))")).toBeCloseTo(2);
  expect(grammar.evaluate("-sqrt(4)")).toBeCloseTo(-2);
});

test("Bad expressions", () => {
  expect(grammar.evaluate("1+2+")).toBe(NaN);
  expect(grammar.evaluate("^1")).toBe(NaN);
  expect(grammar.evaluate("1^")).toBe(NaN);
  expect(grammar.evaluate("1^(3+4")).toBe(NaN);
});
