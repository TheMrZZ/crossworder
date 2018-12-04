export enum Direction {
    HORIZONTAL,
    VERTICAL,
    NONE
}

export function perpendicular(direction: Direction): Direction {
    if (direction === Direction.HORIZONTAL) {
        return Direction.VERTICAL;
    }
    return Direction.HORIZONTAL;
}

export class Cell {
    public wordId: number | null;
    public letter: string;
    public direction: Direction;

    constructor(letter: string, direction: Direction, wordId: number | null) {
        this.letter = letter;
        this.wordId = wordId;
        this.direction = direction;
    }

    static emptyCell() {
        return new this('', Direction.NONE, -1);
    }
}

export class Grid2 {
    private grid: Cell[][];
    private nextId: number;

    constructor() {
        this.grid = [[]];
        this.nextId = 0;
    }

    get height() {
        return this.grid.length;
    }

    get width() {
        return this.grid[0].length;
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
            throw new Error(`Cell is out of bounds (row=${row}, col=${col}, cell=${JSON.stringify(cell)}`);
        }
        this.grid[row][col] = cell;
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

    addWord(word: string, row: number, col: number, direction: Direction) {
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
            endCol += word.length;
        } else {
            endRow += word.length;
        }

        if (endRow >= this.height) {
            this.addEmptyRows(endRow - this.height, false);
        }
        if (endCol >= this.width) {
            this.addEmptyColumns(endCol - this.width, false);
        }

        for (const letter of word) {
            let cell = new Cell(letter, direction, this.nextId);
            this.nextId++;

            this.setCell(cell, row, col);

            if (direction === Direction.HORIZONTAL) {
                col++;
            } else {
                row++;
            }
        }
    }

    getGrid() {
        return this.grid;
    }

    forEachCell(fn: (cell: Cell, row: number, col: number) => void) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const cell = this.grid[row][col];
                fn(cell, row, col);
            }
        }
    }
}