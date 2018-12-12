import debug from './debug';

export enum Direction {
    HORIZONTAL,
    VERTICAL,
    BOTH,
    NONE
}

export function perpendicular(direction: Direction): Direction {
    if (direction === Direction.HORIZONTAL) {
        return Direction.VERTICAL;
    }
    return Direction.HORIZONTAL;
}

export class Cell {
    public wordId: number[];
    public letter: string;
    public direction: Direction;
    public readonly originalDirection: Direction;

    constructor(letter: string, direction: Direction, wordIds: number[]) {
        this.letter = letter;
        this.wordId = wordIds;
        this.direction = direction;
        this.originalDirection = direction;
    }

    static emptyCell() {
        return new this('', Direction.NONE, [-1]);
    }
}

export class Grid {
    private grid: Cell[][];

    constructor() {
        this.grid = [[]];
    }

    get height() {
        return this.grid.length;
    }

    get width() {
        return this.grid[0].length;
    }

    get area() {
        return this.width * this.height;
    }

    inBound(row: number, col: number): boolean {
        return (0 <= row && row < this.height && 0 <= col && col < this.width);
    }

    getCell(row: number, col: number): Cell {
        if (!this.inBound(row, col)) {
            return Cell.emptyCell();
        }

        return this.grid[row][col];
    }

    setCell(cell: Cell, row: number, col: number) {
        if (!this.inBound(row, col)) {
            debug.table(this.grid.map(row => row.map(cell => JSON.stringify(cell))));
            throw new Error(`Cell is out of bounds (row=${row}, col=${col}, cell=${JSON.stringify(cell)}`);
        }

        // If there is no cell, overwrite it
        if (this.grid[row][col].letter === '') {
            this.grid[row][col] = cell;
        } else {
            // If there is already a cell, they have the same letter: merge the IDs
            this.grid[row][col].wordId.push(cell.wordId[0]);
            this.grid[row][col].direction = Direction.BOTH;
        }
    }

    addEmptyRows(n: number = 1, atBeginning: boolean = true) {
        for (let i = 0; i < n; i++) {
            // Get width BEFORE adding a row, because the global width is based on 1st row width
            const currentWidth = this.width;

            if (atBeginning) {
                this.grid.unshift([]);
            } else {
                this.grid.push([]);
            }
            for (let j = 0; j < currentWidth; j++) {
                let row = 0;
                if (!atBeginning) {
                    row = this.height - 1;
                }
                this.grid[row].push(Cell.emptyCell());
            }
        }
    }

    addEmptyColumns(n: number = 1, atBeginning: boolean = true) {
        for (let i = 0; i < n; i++) {
            for (const row of this.grid) {
                if (atBeginning) {
                    row.unshift(Cell.emptyCell());
                } else {
                    row.push(Cell.emptyCell());
                }
            }
        }
    }

    addWord(word: string, row: number, col: number, direction: Direction, wordId: number) {
        if (row < 0) {
            this.addEmptyRows(-row, true);
            row = 0;
        }
        if (col < 0) {
            this.addEmptyColumns(-col, true);
            col = 0;
        }

        let endRow = row, endCol = col;
        if (direction === Direction.HORIZONTAL) {
            endCol += word.length - 1;
        } else {
            endRow += word.length - 1;
        }
        debug.log(`Word is "${word}" (len=${word.length}), row = ${row}, col = ${col}`);
        if (endRow >= this.height) {
            const rows = endRow - this.height + 1;
            debug.log(`endRow = ${endRow}, this.height = ${this.height}, adding ${rows} rows.`);
            this.addEmptyRows(rows, false);
        }
        if (endCol >= this.width) {
            const cols = endCol - this.width + 1;
            debug.log(`endCol = ${endCol}, this.width = ${this.width}, adding ${cols} cols.`);
            this.addEmptyColumns(cols, false);
        }

        for (const letter of word) {
            let cell = new Cell(letter, direction, [wordId]);

            this.setCell(cell, row, col);

            if (direction === Direction.HORIZONTAL) {
                col++;
            } else {
                row++;
            }
        }
    }

    removeWord(wordId: number) {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const index = this.grid[i][j].wordId.indexOf(wordId);
                if (index > -1) {
                    // Remove the id from the list of ids
                    this.grid[i][j].wordId.splice(index, 1);
                }

                // If there is only one ID left, change from Direction.BOTH to the original direction of the cell
                if (this.grid[i][j].wordId.length === 1) {
                    this.grid[i][j].direction = this.grid[i][j].originalDirection;
                }

                // If there is no more IDs, it means that this letter should not exist anymore => delete it
                if (this.grid[i][j].wordId.length === 0) {
                    this.grid[i][j] = Cell.emptyCell();
                }
            }
        }

        this.trimGrid();
    }

    getGrid() {
        return this.grid;
    }

    trimGrid() {
        // First row is empty
        while (!this.grid[0].some(cell => cell.letter !== "")) {
            this.grid.shift();
        }

        // Last row is empty
        while (!this.grid[this.height - 1].some(cell => cell.letter !== "")) {
            this.grid.pop();
        }

        // First col is empty
        while (!this.grid.some(row => row[0].letter !== "")) {
            this.grid.forEach(row => row.shift());
        }

        // Last col is empty
        while (!this.grid.some(row => row[row.length - 1].letter !== "")) {
            this.grid.forEach(row => row.pop());
        }

        if (this.height === 0) {
            this.grid = [[]];
        }
    }

    forEachCell(fn: (cell: Cell, row: number, col: number) => void) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const cell = this.grid[row][col];
                fn(cell, row, col);
            }
        }
    }

    transpose() {
        this.grid = this.grid[0].map((_, i) => this.grid.map(row => row[i]));
    }
}