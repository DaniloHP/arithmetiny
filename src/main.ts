import { MathGrammar } from "./math-grammar";

const grammar = new MathGrammar();
console.log(grammar.evaluate("abs(0 - sqrt(4))"));
