"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invalidPosition(position, cell, initRow, initCol, char, word) {
    let { direction, row, col } = position;
    const rowDiff = Math.abs(cell.row - row), colDiff = Math.abs(cell.col - col);
    let invalidConditions = [
        // No word in parallel
        direction === Direction.HORIZONTAL &&
            cell.direction === Direction.HORIZONTAL &&
            colDiff === 1,
        // No word in parallel
        direction === Direction.VERTICAL &&
            cell.direction === Direction.VERTICAL &&
            rowDiff === 1,
        // Two different letters can't superpose
        cell.letter !== '' &&
            cell.letter !== char &&
            cell.row === row &&
            cell.col === col,
        /*
                // Word can't be placed next to the end of a perpendicular word
                direction === Direction.HORIZONTAL &&
                cell.isLastLetter &&
                rowDiff === 1 &&
                cell.col === col,

                // Word can't be placed next to the end of a perpendicular word
                direction === Direction.VERTICAL &&
                cell.isLastLetter &&
                colDiff === 1 &&
                cell.row === row,
        */
        // No letter can be at the beginning of the word
        direction === Direction.HORIZONTAL &&
            cell.col === initCol - 1 &&
            cell.row === initRow,
        // No letter can be at the beginning of the word
        direction === Direction.VERTICAL &&
            cell.col === initCol &&
            cell.row === initRow - 1,
        // No letter can be at the end of the word
        direction === Direction.HORIZONTAL &&
            cell.col === initCol + word.length + 1 &&
            cell.row === initRow,
        // No letter can be at the end of the word
        direction === Direction.VERTICAL &&
            cell.col === initCol &&
            cell.row === initRow + word.length + 1,
    ];
    return invalidConditions.some(element => element === true);
}
var Direction;
(function (Direction) {
    Direction[Direction["HORIZONTAL"] = 0] = "HORIZONTAL";
    Direction[Direction["VERTICAL"] = 1] = "VERTICAL";
})(Direction || (Direction = {}));
function perpendicular(direction) {
    if (direction === Direction.HORIZONTAL) {
        return Direction.VERTICAL;
    }
    return Direction.HORIZONTAL;
}
class Cell {
    constructor(letter, col, row, direction, wordId, isLastLetter = false) {
        this.letter = letter;
        this.wordId = wordId;
        this.col = col;
        this.row = row;
        this.direction = direction;
        this.isLastLetter = isLastLetter;
    }
}
class Grid {
    constructor(attempts) {
        this.cells = [];
        this.words = [];
        this.nextId = 0;
        this.attempts = attempts || 10;
        this.lonelyWords = 0;
    }
    addWord(word) {
        this.words.push(word);
    }
    addWordToGrid(word) {
        let row = 0;
        let col = 0;
        let direction = Direction.HORIZONTAL;
        if (this.cells.length > 0) {
            let pos = this.getWordCoordinates(word);
            // If we can't find a working position, add the word as horizontal 2 row below the grid
            if (pos === undefined) {
                let limits = this.gridLimits();
                row = limits.maxRow + 2;
                col = limits.minRow;
                direction = Direction.HORIZONTAL;
            }
            else {
                row = pos.row;
                col = pos.col;
                direction = pos.direction;
            }
        }
        this.setWordInGrid(new Cell(word, col, row, direction, this.nextId));
        this.nextId++;
    }
    getWordCoordinates(word) {
        // First, get each possible word position.
        let possiblePositions;
        possiblePositions = [];
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            // Add new positions (cells where the character is the same than the current letter)
            possiblePositions = possiblePositions.concat(this.cells.filter(cell => cell.letter === char).map(cell => {
                let { row, col, direction } = cell;
                // We go in a perpendicular way from the current letter
                if (direction === Direction.HORIZONTAL) {
                    row -= i;
                }
                else {
                    col -= i;
                }
                direction = perpendicular(direction);
                return { row, col, direction };
            }));
        }
        // Then remove the ones which would break existing words.
        possiblePositions = possiblePositions.filter(position => {
            const initRow = position.row, initCol = position.col;
            // Check if every letter will be placed on a valid position
            for (let char of word) {
                for (const cell of this.cells) {
                    if (invalidPosition(position, cell, initRow, initCol, char, word)) {
                        return false;
                    }
                }
                if (position.direction === Direction.HORIZONTAL) {
                    position.col++;
                }
                else {
                    position.row++;
                }
            }
            return true;
        });
        if (possiblePositions.length < 1) {
            return undefined;
        }
        let pos = possiblePositions.map(position => {
            let { row, col, direction } = position;
            // Set the word with the ID -1 to indicate temporary word
            this.setWordInGrid(new Cell(word, col, row, direction, -1));
            // The best word is the one making the grid as square as possible
            let diff = this.gridShapeRatioDiff();
            // Remove the temporary word
            this.delWordFromGrid(-1);
            return {
                row,
                col,
                direction,
                diff
            };
        });
        pos.sort(position => position.diff);
        console.log(JSON.stringify(pos, null, 2));
        // Choose a random position in the best possible positions
        pos = pos.filter(position => position.diff === pos[0].diff);
        let randomPos = pos[Math.floor(Math.random() * pos.length)];
        return { row: randomPos.row, col: randomPos.col, direction: randomPos.direction };
    }
    setWordInGrid(word) {
        let { row, col, direction } = word;
        for (let i = 0; i < word.letter.length; i++) {
            const char = word.letter[i];
            this.cells.push(new Cell(char, col, row, word.direction, word.wordId, i + 1 === word.letter.length));
            if (direction === Direction.HORIZONTAL) {
                col++;
            }
            else {
                row++;
            }
        }
    }
    delWordFromGrid(wordId) {
        let differentWords = (cell) => cell.wordId !== wordId;
        this.cells = this.cells.filter(differentWords);
    }
    gridLimits() {
        return this.cells.reduce((limits, cell) => {
            return {
                minRow: Math.min(limits.minRow, cell.row),
                minCol: Math.min(limits.minCol, cell.col),
                maxRow: Math.max(limits.maxRow, cell.row),
                maxCol: Math.max(limits.maxCol, cell.col)
            };
        }, { minRow: 0, minCol: 0, maxRow: 0, maxCol: 0 });
    }
    gridShape() {
        let limits = this.gridLimits();
        return {
            height: limits.maxRow - limits.minRow + 1,
            width: limits.maxCol - limits.minCol + 1
        };
    }
    /**
     * Returns 1 minus the ratio between height & width of the grid
     */
    gridShapeRatioDiff() {
        let shape = this.gridShape();
        let ratio = shape.height / shape.width;
        return Math.abs(1 - ratio);
    }
    clearGrid() {
        this.cells = [];
        this.lonelyWords = 0;
    }
    generateGrid() {
        this.clearGrid();
        this.words.sort(word => word.length);
        for (const word of this.words) {
            this.addWordToGrid(word);
        }
    }
    generateBestGrid() {
        let bestLonelyWords = this.words.length;
        let bestGridRatio;
        let bestCells;
        for (let i = 0; i < this.attempts; i++) {
            this.generateGrid();
            let gridRatio = this.gridShapeRatioDiff();
            if (bestGridRatio === undefined ||
                this.lonelyWords < bestLonelyWords
                || this.lonelyWords === bestLonelyWords && gridRatio < bestGridRatio) {
                bestGridRatio = gridRatio;
                bestLonelyWords = this.lonelyWords;
                bestCells = this.cells;
            }
        }
        if (bestCells === undefined) {
            this.generateGrid();
        }
        else {
            this.cells = bestCells;
        }
    }
    asTable() {
        this.generateBestGrid();
        let limits = this.gridLimits();
        let shape = this.gridShape();
        // Creates a table full of empty DIFFERENT arrays (just array.fill([]) would create arrays with same reference)
        let table = new Array(shape.height).fill(undefined).map(() => {
            return new Array(shape.width).fill({ word: '', wordId: null }, 0, shape.width);
        });
        for (const cell of this.cells) {
            table[cell.row - limits.minRow][cell.col - limits.minCol] = {
                word: cell.letter,
                wordId: cell.wordId
            };
        }
        return table;
    }
}
exports.default = Grid;
