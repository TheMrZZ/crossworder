import debug from './debug';

import {Direction, Grid as Grid, perpendicular} from './grid';
import {shuffle} from './utils';

type Position = {
    row: number,
    col: number,
    direction: Direction
}

function allIndexesOf(str: string, searchString: string, position: number = 0) {
    let indexes = [];
    for (let i = position; i < str.length; i++) {
        const char = str[i];
        if (char === searchString) {
            indexes.push(i);
        }
    }

    return indexes;
}

function getRatio(height: number, width: number): number {
    // If width or height is 0, the grid is in 1D, the ratio can't be better
    if (height === 0 || width === 0) {
        return 0;
    }

    const wantedRatio = 0.5;
    return Math.abs(wantedRatio - height / width);
}

export class Crossword {
    private grid: Grid;
    private nextId: number;
    private lonelyWords: number;
    private words: string[];
    private readonly attempts: number;
    private readonly minimumRatio: number;
    private sortedWords: string[];

    constructor(attempts: number = 1, minimumRatio: number = 0.25) {
        this.words = [];
        this.grid = new Grid();
        this.nextId = 0;
        this.lonelyWords = 0;
        this.attempts = attempts;
        this.minimumRatio = minimumRatio;
        this.sortedWords = []
    }

    getGrid() {
        return this.grid;
    }

    addWord(word: string) {
        this.words.push(word);
    }

    private clear() {
        this.grid = new Grid();
        this.nextId = 0;
        this.lonelyWords = 0;
    }

    private _generate(random: boolean = false) {
        // We have to copy the words, because else it will change the bestGrid words too
        if (!random) {
            this.words = this.sortedWords;
        } else {
            shuffle([...this.words]);
        }

        for (const word of this.words) {
            let pos = this.getWordCoordinates(word);
            this.grid.addWord(word, pos.row, pos.col, pos.direction, this.nextId);
            this.nextId++;
            debug.table(this.grid.getGrid().map(row => row.map(cell => cell.letter)));
        }
    }

    generate() {
        this.sortedWords = [...this.words].sort((s1, s2) => s2.length - s1.length);
        let bestCrossword: Crossword | undefined;
        let bestRatio: number | undefined;

        for (let i = 0;
             i < this.attempts || (bestRatio !== undefined && bestRatio < this.minimumRatio && i < 2 * this.attempts);
             i++) {
            this.clear();
            this._generate(i < this.attempts / 2);

            // We aim for the height to be half of the width
            let ratio = getRatio(this.grid.height, this.grid.width);
            // noinspection JSSuspiciousNameCombination
            let transposedRatio = getRatio(this.grid.width, this.grid.height);
            if (transposedRatio < ratio) {
                this.grid.transpose();
                ratio = transposedRatio;
            }

            debug.log('Grid Ratio:', ratio, '- lonely words:', this.lonelyWords);
            if (bestCrossword === undefined || bestRatio === undefined ||
                this.lonelyWords < bestCrossword.lonelyWords ||
                this.lonelyWords === bestCrossword.lonelyWords && ratio <= bestRatio && this.grid.area < bestCrossword.grid.area) {
                bestRatio = ratio;
                bestCrossword = Object.assign({}, this);
            }
        }

        Object.assign(this, bestCrossword);
        debug.log('Best ratio:', bestRatio, '- best lonely words:', this.lonelyWords);
    }

    private getWordCoordinates(word: string): Position {
        if (this.grid.width === 0) {
            return {row: 0, col: 0, direction: Direction.HORIZONTAL};
        }

        // Possible starting positions for the new word
        let possiblePositions: Position[] = [];


        this.grid.forEachCell(((cell, row, col) => {
            // Take only the cells which have the same letter than one in the word
            const indexes = allIndexesOf(word, cell.letter);
            for (const index of indexes) {
                let direction = perpendicular(cell.direction);
                let pos = {row, col, direction};

                if (direction === Direction.VERTICAL) {
                    pos.row -= index;
                } else {
                    pos.col -= index;
                }

                possiblePositions.push(pos);
            }
        }));
        debug.log('Possible positions:', possiblePositions);

        // Remove positions where word would break the crossword rules
        possiblePositions = possiblePositions.filter(position => {
            let {row, col, direction} = position;

            // No letter before the beginning of the word
            if (direction === Direction.HORIZONTAL && this.grid.getCell(row, col - 1).letter !== '' ||
                direction === Direction.VERTICAL && this.grid.getCell(row - 1, col).letter !== '') {
                return false;
            }

            for (const letter of word) {
                const cell = this.grid.getCell(row, col);

                if (
                    // Can't cross a different letter
                    cell.letter !== '' && cell.letter !== letter ||

                    // Can't overlap a word going in the same direction
                    cell.direction === direction ||

                    // For vertical words:
                    direction === Direction.VERTICAL && (
                        // No word in parallel
                        [direction, Direction.BOTH].indexOf(this.grid.getCell(row, col - 1).direction) > -1 ||

                        // No word in parallel
                        [direction, Direction.BOTH].indexOf(this.grid.getCell(row, col + 1).direction) > -1 ||

                        // Word can't be placed next to the end of a perpendicular word
                        [perpendicular(direction), Direction.BOTH].indexOf(this.grid.getCell(row, col - 1).direction) > -1
                        && cell.letter === ''
                    ) ||

                    // For horizontal words:
                    direction === Direction.HORIZONTAL && (
                        // No word in parallel
                        [direction, Direction.BOTH].indexOf(this.grid.getCell(row - 1, col).direction) > -1 ||

                        // No word in parallel
                        [direction, Direction.BOTH].indexOf(this.grid.getCell(row + 1, col).direction) > -1 ||

                        // Word can't be placed next to the end of a perpendicular word
                        [perpendicular(direction), Direction.BOTH].indexOf(this.grid.getCell(row - 1, col).direction) > -1
                        && cell.letter === ''
                    )

                ) {
                    return false;
                }

                if (direction === Direction.HORIZONTAL) {
                    col++;
                } else {
                    row++;
                }
            }

            // No letter after the end of the word
            return this.grid.getCell(row, col).letter === '';
        });

        if (possiblePositions.length === 0) {
            this.lonelyWords++;
            return {row: this.grid.height + 1, col: 0, direction: Direction.HORIZONTAL};
        }

        // Now, positions are valid. We take a random one
        return possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }

    public getWords() {
        return this.words;
    }

    deleteWord(index: number) {
        this.words.splice(index, 1);
    }
}