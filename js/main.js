"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crossword_1 = __importDefault(require("./crossword"));
let crossword = new crossword_1.default(500);
crossword.addWord('eau');
crossword.addWord('attaque');
crossword.addWord('vendre');
crossword.addWord('attraper');
console.time("total");
crossword.generate();
console.timeEnd("total");
console.log('THE BEST CROSSWORD IS...');
console.table(crossword.getGrid().getGrid().map(row => row.map(cell => cell.letter)));
