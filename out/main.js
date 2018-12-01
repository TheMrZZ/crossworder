"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = __importDefault(require("./grid"));
let grid = new grid_1.default();
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
grid.addWord('testa');
grid.addWord('etat');
grid.addWord('tarte');
grid.addWord('vente');
grid.addWord('acheter');
grid.addWord('acheter');
displayGrid(grid.asTable());
