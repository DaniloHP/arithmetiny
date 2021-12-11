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
  expect(grammar.evaluate("1/2/3/4")).toBe(1 / 2 / 3 / 4);
  expect(grammar.evaluate("2^(5+15)")).toBe(1048576);
  expect(grammar.evaluate("e")).toBe(Math.E);
});

test("Bad expressions", () => {
  expect(grammar.evaluate("1+2+")).toBe(NaN);
  expect(grammar.evaluate("^1")).toBe(NaN);
  expect(grammar.evaluate("1^")).toBe(NaN);
  expect(grammar.evaluate("1^(3+4")).toBe(NaN);
});
