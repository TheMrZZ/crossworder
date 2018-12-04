"use strict";
/*import Grid from './grid';

let grid = new Grid(50);

function displayGrid(table: { word: string, wordId: number | null }[][]) {
    console.table(table.map(row => row.map(cell => cell.word)));
}

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

console.time("total");
displayGrid(grid.asTable());
console.timeEnd("total");*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crossword_1 = __importDefault(require("./crossword"));
console.time("total");
let crossword = new crossword_1.default(50);
crossword.addWord('eau');
crossword.addWord('attaque');
crossword.addWord('vendre');
crossword.addWord('attraper');
console.timeEnd("total");
