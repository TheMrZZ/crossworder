"use strict";
/*import Grid from './grid';

let grid = new Grid(50);

function displayGrid(table: { word: string, wordId: number | null }[][]) {
    console.table(table.map(row => row.map(cell => cell.word)));
}

grid.addWord('eau');
grid.addWord('etat');
grid.addWord('racine');
grid.addWord('acheter');
grid.addWord('bonsoir');
grid.addWord('deux');
grid.addWord('warning');
grid.addWord('array');

console.time("total");
displayGrid(grid.asTable());
console.timeEnd("total");*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crossword_1 = __importDefault(require("./crossword"));
let crossword = new crossword_1.default();
crossword.addWord("test");
crossword.addWord("tast");
