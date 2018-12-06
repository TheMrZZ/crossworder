import {Crossword} from './crossword';
import {Latinize} from "./latinize";

let table: HTMLElement | null;
let input: HTMLInputElement | null;
let crossword: Crossword;

document.addEventListener("DOMContentLoaded", function () {
    table = document.getElementById('crossword');
    let form = document.getElementById('wordForm');
    input = document.getElementById('wordInput') as HTMLInputElement;

    if (table === null || form === null || input === null) {
        throw new Error('Table or form or input is null.');
    }
    form.onsubmit = addWord;
    crossword = new Crossword(100);
});

function addWord() {
    if (table === null || input === null) {
        throw new Error('Table or input is null.');
    }

    const word = Latinize.latinize(input.value).toUpperCase();
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

    crossword.getGrid().getGrid().forEach(function(rowData) {
        let row = document.createElement('tr');

        rowData.forEach(function(cellData) {
            let cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData.letter));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);
}