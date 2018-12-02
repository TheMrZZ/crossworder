"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = __importDefault(require("./grid"));
let grid = new grid_1.default(50);
function displayGrid(table) {
    for (const row of table) {
        let rowDisplay = '';
        for (const cell of row) {
            if (cell.word === '') {
                rowDisplay += '  ';
            }
            else {
                rowDisplay += cell.word + ' ';
            }
        }
        console.log(rowDisplay + '\n');
    }
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
console.timeEnd("total");
