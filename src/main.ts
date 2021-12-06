import MathGrammar from "./math-grammar";

const grammar = new MathGrammar();
console.log(grammar.evaluate("2^(4)"));
console.log(grammar.evaluate("2^((1+2+3+4+5+6+7+8+9)/9 % 2 + 4)"));
console.log(grammar.evaluate("2^2^2^2")); //TODO: wrong
