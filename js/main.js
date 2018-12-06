"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crossword_1 = require("./crossword");
const latinize_1 = require("./latinize");
let table;
let input;
let crossword;
document.addEventListener("DOMContentLoaded", function () {
    table = document.getElementById('crossword');
    let form = document.getElementById('wordForm');
    input = document.getElementById('wordInput');
    if (table === null || form === null || input === null) {
        throw new Error('Table or form or input is null.');
    }
    form.onsubmit = addWord;
    crossword = new crossword_1.Crossword(100);
});
function addWord() {
    if (table === null || input === null) {
        throw new Error('Table or input is null.');
    }
    const word = latinize_1.Latinize.latinize(input.value).toUpperCase();
    console.log('WORD IS', word);
    crossword.addWord(word);
    crossword.generate();
    console.log(crossword.getGrid().getGrid().map(row => row.map(cell => cell.letter)));
    createTable();
}
function createTable() {
    if (table === null) {
        throw new Error('Table is null.');
    }
    table.innerHTML = '';
    let tableBody = document.createElement('tbody');
    crossword.getGrid().getGrid().forEach(function (rowData) {
        let row = document.createElement('tr');
        rowData.forEach(function (cellData) {
            let cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData.letter));
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
}
//# sourceMappingURL=main.js.map