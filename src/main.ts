import {Crossword} from './crossword';
import {randomRange, Latinize} from "./utils";
import html2canvas from "html2canvas";
import {saveAs} from "file-saver";

// Don't remove: it allows webpack to understand it should compile the CSS file
import './index.css';

import debug from "./debug";

let tableBody: HTMLTableSectionElement;
let input: HTMLInputElement | null;
let crossword: Crossword;
let wordList: HTMLUListElement;
let sizeSlider: HTMLInputElement;

const numberOfColors = 16;
let wordColorNumber: { [key: number]: number } = {};

document.addEventListener("DOMContentLoaded", function () {
    tableBody = (document.getElementById('crossword') as Element).children[0] as HTMLTableSectionElement;
    input = document.getElementById('wordInput') as HTMLInputElement;
    wordList = document.getElementById('wordList') as HTMLUListElement;
    let form = document.getElementById('wordForm');
    (document.getElementById('saveCrossword') as HTMLButtonElement).onclick = saveGrid;

    if (tableBody === null || form === null || input === null) {
        throw new Error('Table or form or input is null.');
    }
    form.onsubmit = addInputWord;
    crossword = new Crossword(20);

    sizeSlider = document.getElementById('sizeSlider') as HTMLInputElement;
    sizeSlider.value = "50";
    sizeSlider.oninput = changeTableFontSize;
});

function addInputWord() {
    if (tableBody === null || input === null) {
        throw new Error('Table or input is null.');
    }

    addWord(input.value);
    input.value = "";
}

function addWord(word: string) {
    word = Latinize.latinize(word).toUpperCase().replace(/ /g, '');
    crossword.addWord(word);
    generate();
}

function generate() {
    debug.time('Time to generate');
    crossword.generate();
    debug.timeEnd('Time to generate');
    debug.log(crossword.getGrid().getGrid().map(row => row.map(cell => cell.letter)));

    // Choose random colors
    randomRange(0, numberOfColors).forEach(((value, index) => {
        wordColorNumber[index] = value;
    }));

    createTable();
    createWordList(crossword.getWords());
    addHover();
    addDeleteWord();
}

function createTable() {
    if (tableBody === null) {
        throw new Error('Table is null.');
    }
    tableBody.innerHTML = "";

    crossword.getGrid().getGrid()
        .map(
            row => row.map(cell => {
                return {
                    letter: cell.letter,
                    wordNumber: wordColorNumber[cell.wordId[0] % numberOfColors],
                    ids: cell.wordId
                };
            })
        )

        .forEach(function (rowData) {
            let row = document.createElement('tr');
            rowData.forEach(function (cellData) {
                let cell = document.createElement('td');
                if (cellData.letter !== "") {
                    cell.className = `letter word${cellData.wordNumber} num${cellData.ids.join(' num')}`;
                    cell.innerText = cellData.letter;
                }
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
}

function createWordList(words: string[]) {
    while (wordList.firstChild) {
        wordList.removeChild(wordList.firstChild);
    }

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let li = document.createElement('li');
        li.className = `letter word${wordColorNumber[i % numberOfColors]} num${i}`;
        li.innerHTML = `<img class="deleteWord" src="./dist/trash.svg" alt="Delete the word" title="Delete the word '${word}'"> <span>${word}</span>`;
        wordList.appendChild(li);
    }
}

function addHover() {
    for (const letter of document.getElementsByClassName('letter')) {
        let classes = [];
        for (const cls of letter.classList) {
            if (cls.startsWith('num')) {
                classes.push(cls);
            }
        }

        let sameWordLetters: HTMLDivElement[] = [];
        for (const otherLetter of document.getElementsByClassName('letter')) {
            for (const cls of classes) {
                if (otherLetter.classList.contains(cls) && otherLetter.tagName.toLowerCase() === 'td') {
                    sameWordLetters.push(otherLetter as HTMLDivElement);
                    break;
                }
            }
        }

        (letter as HTMLDivElement).onmouseover = function () {
            for (const sameWordLetter of sameWordLetters) {
                sameWordLetter.classList.add('selected');
            }
        };
        (letter as HTMLDivElement).onmouseleave = function () {
            for (const sameWordLetter of sameWordLetters) {
                sameWordLetter.classList.remove('selected');
            }
        };
    }
}

function addDeleteWord() {
    for (const child of wordList.children) {
        const cls = child.className.split(' ').filter(cls => cls.startsWith('num'))[0];
        // @ts-ignore
        const classNum = parseInt(cls.match(/num(\d+)/)[1]);
        const trash = Array.from(child.children).filter(el => el.classList.contains('deleteWord'))[0] as HTMLImageElement;
        trash.onclick = function () {
            crossword.deleteWord(classNum);
            generate();
        };
    }
}

function saveGrid() {
    // We need to use the tbody, since it has the real dimension of the table. The table element can be larger than the real table

    document.body.classList.add('screenshot');

    let height = document.body.offsetHeight;
    let width = document.body.offsetWidth;

    let rows = tableBody.children.length;
    let cols = 0;
    if (rows > 0) {
        cols = (tableBody.children[0] as HTMLTableRowElement).children.length;
    }

    let verticalSize = Math.floor(height / rows);
    let horizontalSize = Math.floor(width / cols);
    let fontSize = Math.min(verticalSize, horizontalSize);

    tableBody.style.fontSize = fontSize + 'px';

    // Problem: the real font size won't be fontSize px, but more - since cells take a bit more space. We have to scale it
    const cell = (tableBody.children[0].children[0] as HTMLTableCellElement);
    let realSize = verticalSize < horizontalSize ? cell.offsetHeight : cell.offsetWidth;
    let scaleFactor = realSize / fontSize;

    fontSize = Math.floor(fontSize / scaleFactor);
    tableBody.style.fontSize = fontSize + 'px';

    html2canvas(tableBody, {
        allowTaint: true,
        foreignObjectRendering: true,
        scale: 1,
        logging: false
    }).then(canvas => {
        canvas.toBlob(function (blob) {
            saveAs(blob as Blob, 'motsCroises.png');
        });
        document.body.classList.remove('screenshot');
        changeTableFontSize();
    });
}

function changeTableFontSize() {
    const diff = 50 - parseInt(sizeSlider.value);
    tableBody.style.fontSize = `calc(1em - ${diff}px)`;
}