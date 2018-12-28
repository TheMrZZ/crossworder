import debug from './debug'

export enum Direction {
  HORIZONTAL,
  VERTICAL,
  BOTH,
  NONE
}

export function perpendicular (direction: Direction): Direction {
  if (direction === Direction.HORIZONTAL) {
    return Direction.VERTICAL
  }
  if (direction === Direction.VERTICAL) {
    return Direction.HORIZONTAL
  }
  return direction
}

export class Cell {
  public wordId: number[]
  public letter: string
  public direction: Direction
  public forbiddenDirections: Set<Direction>
  public readonly originalDirection: Direction

  constructor (letter: string, direction: Direction, wordIds: number[]) {
    this.letter = letter
    this.wordId = wordIds
    this.direction = direction
    this.originalDirection = direction
    this.forbiddenDirections = new Set()
  }

  get empty () {
    return this.direction === Direction.NONE
  }
}

// Creates an empty cell
function emptyCell () {
  return new Cell('', Direction.NONE, [-1])
}

const iterCells = function * (this: Grid): IterableIterator<{ cell: Cell, row: number, col: number }> {
  let grid = this.getGrid()
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col]
      if (!cell.empty) {
        yield { cell, row, col }
      }
    }
  }
}

export class Grid {
  private grid: Cell[][]

  constructor () {
    this.grid = [[]]
  }

  get height () {
    return this.grid.length
  }

  get width () {
    return this.grid[0].length
  }

  get area () {
    return this.width * this.height
  }

  inBound (row: number, col: number): boolean {
    return (0 <= row && row < this.height && 0 <= col && col < this.width)
  }

  getCell (row: number, col: number): Cell {
    if (!this.inBound(row, col)) {
      return emptyCell()
    }

    return this.grid[row][col]
  }

  setCell (cell: Cell, row: number, col: number) {
    if (!this.inBound(row, col)) {
      debug.table(this.grid.map(row => row.map(cell => JSON.stringify(cell))))
      throw new Error(`Cell is out of bounds (row=${row}, col=${col}, cell=${JSON.stringify(cell)}`)
    }

    // If there is no cell, overwrite it
    if (this.grid[row][col].empty) {
      this.grid[row][col] = cell
    } else {
      // If there is already a cell, they have the same letter: merge the IDs
      this.grid[row][col].wordId.push(cell.wordId[0])
      this.grid[row][col].direction = Direction.BOTH
    }
  }

  addEmptyRows (n: number = 1, atBeginning: boolean = true) {
    for (let i = 0; i < n; i++) {
      // Get width BEFORE adding a row, because the global width is based on 1st row width
      const currentWidth = this.width

      // Insert the row
      if (atBeginning) {
        this.grid.unshift([])
      } else {
        this.grid.push([])
      }

      let row = 0
      let previousRow = row + 1

      if (!atBeginning) {
        row = this.height - 1
        previousRow = row - 1
      }

      // Fill the row with empty cells
      for (let j = 0; j < currentWidth; j++) {
        this.grid[row].push(emptyCell())

        // If the neighbour cell (vertical neighbour) is a vertical letter,
        // no letter can be added here. If it is an horizontal letter, vertical letters are possible here.
        let neighbourCell = this.getCell(previousRow, j)

        // No need to check for boundaries (i.e. row could not exist if grid is empty),
        // because getCell will return the empty cell if out of bound

        if (!neighbourCell.empty) {

          // This direction is always forbidden
          this.addForbiddenDirection(Direction.HORIZONTAL, row, j)

          if (neighbourCell.direction === Direction.VERTICAL) {
            this.addForbiddenDirection(Direction.VERTICAL, row, j)
          }
        }
      }
    }
  }

  addEmptyColumns (n: number = 1, atBeginning: boolean = true) {
    for (let i = 0; i < n; i++) {
      for (const row of this.grid) {
        let newCell = emptyCell()
        let neighbourCell: Cell

        if (row.length > 0) {

          // If the neighbour cell (horizontal neighbour) is an horizontal letter,
          // no letter can be added here. If it is a vertical letter, horizontal letters are possible here.
          if (atBeginning) {
            neighbourCell = row[0]
          } else {
            neighbourCell = row[row.length - 1]
          }

          // This direction is always forbidden
          newCell.forbiddenDirections.add(Direction.VERTICAL)

          if (neighbourCell.direction === Direction.VERTICAL) {
            newCell.forbiddenDirections.add(Direction.HORIZONTAL)
          }
        }

        if (atBeginning) {
          // If the neighbour cell (horizontal neighbour) is not empty, we cannot add a letter at the current cell

          row.unshift(newCell)
        } else {
          if (row.length > 0 && !row[row.length - 1].empty) {
          }

          row.push(newCell)
        }
      }
    }
  }

  addWord (word: string, row: number, col: number, direction: Direction, wordId: number) {
    if (word.length <= 0) {
      return
    }

    if (row < 0) {
      this.addEmptyRows(-row, true)
      row = 0
    }
    if (col < 0) {
      this.addEmptyColumns(-col, true)
      col = 0
    }

    let endRow = row, endCol = col
    if (direction === Direction.HORIZONTAL) {
      endCol += word.length - 1
    } else {
      endRow += word.length - 1
    }
    debug.log(`Word is "${word}" (len=${word.length}), row = ${row}, col = ${col}`)
    if (endRow >= this.height) {
      const rows = endRow - this.height + 1
      debug.log(`endRow = ${endRow}, this.height = ${this.height}, adding ${rows} rows.`)
      this.addEmptyRows(rows, false)
    }
    if (endCol >= this.width) {
      const cols = endCol - this.width + 1
      debug.log(`endCol = ${endCol}, this.width = ${this.width}, adding ${cols} cols.`)
      this.addEmptyColumns(cols, false)
    }

    // No letters can be put anymore before the start of this word
    if (direction === Direction.HORIZONTAL) {
      this.addForbiddenDirection(Direction.HORIZONTAL, row, col - 1)
      this.addForbiddenDirection(Direction.VERTICAL, row, col - 1)
    } else {
      this.addForbiddenDirection(Direction.HORIZONTAL, row - 1, col)
      this.addForbiddenDirection(Direction.VERTICAL, row - 1, col)
    }

    for (const letter of word) {
      let cell = new Cell(letter, direction, [wordId])

      this.setCell(cell, row, col)

      if (direction === Direction.HORIZONTAL) {
        this.addForbiddenDirection(direction, row - 1, col)
        this.addForbiddenDirection(direction, row, col)
        this.addForbiddenDirection(direction, row + 1, col)

        col++
      } else {
        this.addForbiddenDirection(direction, row, col - 1)
        this.addForbiddenDirection(direction, row, col)
        this.addForbiddenDirection(direction, row, col + 1)

        row++
      }
    }

    // No letter can be put at the end of the word either
    this.addForbiddenDirection(Direction.HORIZONTAL, row, col)
    this.addForbiddenDirection(Direction.VERTICAL, row, col)
  }

  addForbiddenDirection (direction: Direction, row: number, col: number) {
    if (this.inBound(row, col)) {
      this.grid[row][col].forbiddenDirections.add(direction)
    }
  }

  getGrid () {
    return this.grid
  }

  iterCells = iterCells.bind(this)

  transpose () {
    let newGrid: Cell[][] = new Array(this.width)
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i] = new Array(this.height)
    }

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        newGrid[col][row] = this.grid[row][col]

        let newForbiddenDirections: Set<Direction> = new Set()
        for (const forbiddenDirection of newGrid[col][row].forbiddenDirections) {
          newForbiddenDirections.add(perpendicular(forbiddenDirection))
        }

        newGrid[col][row].forbiddenDirections = newForbiddenDirections
      }
    }

    this.grid = newGrid
  }
}