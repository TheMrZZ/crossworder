import {Crossword} from './crossword';
import {randomRange, Latinize} from "./utils";

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
    form.onsubmit = addInputWord;
    crossword = new Crossword(20);
});

function addInputWord() {
    if (table === null || input === null) {
        throw new Error('Table or input is null.');
    }

    addWord(input.value);
}

function addWord(word: string) {
    word = Latinize.latinize(word).toUpperCase().replace(/ /g, '');
    crossword.addWord(word);
    console.time('Time to generate');
    crossword.generate();
    console.timeEnd('Time to generate');
    console.log(crossword.getGrid().getGrid().map(row => row.map(cell => cell.letter)));
    createTable();
}

function createTable() {
    if (table === null) {
        throw new Error('Table is null.');
    }
    table.innerHTML = '';
    let tableBody = document.createElement('tbody');

    const numberOfColors = 16;
    let wordColorNumber: { [key: number]: number } = {};
    randomRange(0, numberOfColors).forEach(((value, index) => {
        wordColorNumber[index] = value;
    }));

    crossword.getGrid().getGrid()
        .map(
            row => row.map(cell => {
                return {letter: cell.letter, wordNumber: wordColorNumber[cell.wordId[0] % numberOfColors]};
            })
        )

        .forEach(function (rowData) {
            let row = document.createElement('tr');
            rowData.forEach(function (cellData) {
                let cell = document.createElement('td');
                cell.innerHTML = `<span class="word${cellData.wordNumber}">${cellData.letter || '&nbsp;'}</span>`;
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    table.appendChild(tableBody);
}