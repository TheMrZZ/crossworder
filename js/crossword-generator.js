"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrossWord {
    constructor() {
        this.grid = [[]];
        this.words = [];
        this.nrow = 0;
        this.ncol = 0;
    }
    addWord(word) {
        this.words.push(word);
    }
    getAsArray() {
        this.words.sort(word => word.length);
        let words = this.words.slice(); // copy the string
        let firstWord = words.pop() || '';
        this.grid = [[]];
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const id = i + 1;
        }
    }
    addWordToGrid(word, id) {
        if (this.nrow === 1 && this.ncol === 0) {
            this.grid[0] = Array.from(word).map(letter => new Cell(letter, id));
            this.ncol = word.length;
        }
    }
    setWord(word, id, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
        }
    }
}
exports.CrossWord = CrossWord;
