import { MathGrammar } from "./math-grammar";

const grammar = new MathGrammar();
test("adds 1 + 2 to equal 3", () => {
  expect(grammar.evaluate("1+2")).toBe(3);
});
test("A bad expression", () => {
  expect(grammar.evaluate("1+2+")).toBe(NaN);
});
