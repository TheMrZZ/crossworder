import {Direction, Grid2 as Grid, perpendicular} from './grid2';

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

export default class Crossword {
    private words: string[];
    private grid: Grid;
    private nextId: number;
    private lonelyWords: number;
    private attempts: number;

    constructor(attempts: number = 1) {
        this.words = [];
        this.grid = new Grid();
        this.nextId = 0;
        this.lonelyWords = 0;
        this.attempts = attempts;
    }

    getGrid() {
        return this.grid;
    }

    addWord(word: string) {
        let pos = this.getWordCoordinates(word);
        this.grid.addWord(word, pos.row, pos.col, pos.direction, this.nextId);
        this.nextId++;
        console.table(this.grid.getGrid().map(row => row.map(cell => cell.letter)));

        this.words.push(word);
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

                if (index >= 0) {
                    let direction = perpendicular(cell.direction);

                    if (direction === Direction.VERTICAL) {
                        row -= index;
                    } else {
                        col -= index;
                    }

                    possiblePositions.push({row, col, direction});
                }
            }
        }));
        console.log('Possible positions:', possiblePositions);

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
            return {row: this.grid.height + 1, col: 0, direction: Direction.HORIZONTAL};
        }

        // Now, positions are valid. We take a random one
        return possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }
}