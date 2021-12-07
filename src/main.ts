import MathGrammar from "./math-grammar";

const grammar = new MathGrammar();
console.log(grammar.evaluate("(1)"));
console.log(grammar.evaluate("2^4"));
console.log(grammar.evaluate("2^((1+2+3)/9 % 2 + 4)"));
console.log(grammar.evaluate("2^2^2^2"));
console.log(grammar.evaluate("2^2^2"));
