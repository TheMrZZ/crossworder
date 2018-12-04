import {Direction, Grid2 as Grid, perpendicular} from './grid2';

type Position = {
    row: number,
    col: number,
    direction: Direction
}

function allIndexesOf(str: string, searchString: string, position?: number) {
    let indexes = [];
    for (let i = 0; i < str.length; i++) {
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

    constructor() {
        this.words = [];
        this.grid = new Grid();
    }

    getGrid() {
        return this.grid;
    }

    addWord(word: string) {
        let pos = this.getWordCoordinates(word);
        this.grid.addWord(word, pos.row, pos.col, pos.direction);
        console.table(this.grid.getGrid().map(row => row.map(cell => cell.letter)));

        this.words.push(word);
    }

    private getWordCoordinates(word: string): Position {
        if (this.words.length === 0) {
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
        console.log(possiblePositions);

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
                        this.grid.getCell(row - 1, col).direction === direction ||

                        // No word in parallel
                        this.grid.getCell(row + 1, col).direction === direction ||

                        // Word can't be placed next to the end of a perpendicular word
                        this.grid.getCell(row, col - 1).direction === perpendicular(direction) && cell.letter === ''
                    ) ||

                    // For horizontal words:
                    direction === Direction.HORIZONTAL && (
                        // No word in parallel
                        this.grid.getCell(row, col - 1).direction === direction ||

                        // No word in parallel
                        this.grid.getCell(row, col + 1).direction === direction ||

                        // Word can't be placed next to the end of a perpendicular word
                        this.grid.getCell(row - 1, col).direction === perpendicular(direction) && cell.letter === ''
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

        // Now, positions are valid. Let's take a random one for now
        return possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }
}