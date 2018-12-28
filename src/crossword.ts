import debug from './debug'

import { Direction, Grid as Grid, perpendicular } from './grid'
import { shuffle } from './utils'

type Position = {
  row: number,
  col: number,
  direction: Direction
}

function * allIndexesOf (str: string, searchString: string, position: number = 0): IterableIterator<number> {
  for (let index = position; index < str.length; index++) {
    const char = str[index]
    if (char === searchString) {
      yield index
    }
  }
}

function getRatio (height: number, width: number): number {
  // If width or height is 0, the grid is in 1D, the ratio can't be better
  if (height === 0 || width === 0) {
    return 0
  }

  const wantedRatio = 0.5
  return Math.abs(wantedRatio - height / width)
}

export class Crossword {
  private grid: Grid
  private nextId: number
  private lonelyWords: number
  private words: string[]
  private readonly attempts: number
  private readonly minimumRatio: number
  private sortedWords: string[]

  constructor (attempts: number = 1, minimumRatio: number = 0.25) {
    this.words = []
    this.grid = new Grid()
    this.nextId = 0
    this.lonelyWords = 0
    this.attempts = attempts
    this.minimumRatio = minimumRatio
    this.sortedWords = []
  }

  getGrid () {
    return this.grid
  }

  addWord (word: string) {
    this.words.push(word)
  }

  private clear () {
    this.grid = new Grid()
    this.nextId = 0
    this.lonelyWords = 0
  }

  private _generate (random: boolean = false) {
    // We have to copy the words, because else it will change the bestGrid words too
    if (!random) {
      this.words = this.sortedWords
    } else {
      shuffle([...this.words])
    }

    for (const word of this.words) {
      let pos = this.getWordCoordinates(word)
      this.grid.addWord(word, pos.row, pos.col, pos.direction, this.nextId)
      this.nextId++
      debug.table(this.grid.getGrid().map(row => row.map(cell => cell.letter)))
      debug.table(this.grid.getGrid().map(row => row.map(cell => cell.forbiddenDirections)))
    }
  }

  generate () {
    this.sortedWords = [...this.words].sort((s1, s2) => s2.length - s1.length)
    let bestCrossword: Crossword | undefined
    let bestRatio: number | undefined

    for (let i = 0;
         i < this.attempts || (bestRatio !== undefined && bestRatio < this.minimumRatio && i < 2 * this.attempts);
         i++) {
      this.clear()
      this._generate(i < this.attempts / 2)

      // We aim for the height to be half of the width
      let ratio = getRatio(this.grid.height, this.grid.width)
      // noinspection JSSuspiciousNameCombination
      let transposedRatio = getRatio(this.grid.width, this.grid.height)
      if (transposedRatio < ratio) {
        this.grid.transpose()
        ratio = transposedRatio
      }

      debug.log('Grid Ratio:', ratio, '- lonely words:', this.lonelyWords)
      if (bestCrossword === undefined || bestRatio === undefined ||
        this.lonelyWords < bestCrossword.lonelyWords ||
        this.lonelyWords === bestCrossword.lonelyWords && ratio <= bestRatio && this.grid.area < bestCrossword.grid.area) {
        bestRatio = ratio
        bestCrossword = Object.assign({}, this)
      }
    }

    Object.assign(this, bestCrossword)
    debug.log('Best ratio:', bestRatio, '- best lonely words:', this.lonelyWords)
  }

  private getWordCoordinates (word: string): Position {
    debug.log('Getting coordinates for word', word)
    if (this.grid.width === 0) {
      return { row: 0, col: 0, direction: Direction.HORIZONTAL }
    }

    // Gets the possible positions for the new word
    function getPossiblePositions (grid: Grid) {
      debug.log('Getting possible positions')
      let positions = []
      for (const { cell, row, col } of grid.iterCells()) {
        // Take only the cells which have the same letter than one in the word
        for (const index of allIndexesOf(word, cell.letter)) {

          // If the cell is at the intersection of two words, no words can be placed here
          if (cell.direction === Direction.BOTH) {
            continue
          }

          let direction = perpendicular(cell.direction)
          let pos = { row, col, direction }

          if (direction === Direction.VERTICAL) {
            pos.row -= index
          } else {
            pos.col -= index
          }

          if (validPosition(grid, pos)) {
            positions.push(pos)
          }
        }
      }
      return positions
    }

    // Remove positions where word would break the crossword rules
    function validPosition (grid: Grid, position: Position): boolean {
      let { row, col, direction } = position

      for (const letter of word) {
        let cell = grid.getCell(row, col)

        if (
          !cell.empty && (
            cell.forbiddenDirections.has(direction) ||

            // Can't cross a different letter
            cell.letter !== letter
          )
        ) {
          return false
        }

        if (direction === Direction.HORIZONTAL) {
          col++
        } else {
          row++
        }
      }

      return true
    }

    let possiblePositions = getPossiblePositions(this.grid)

    debug.log('Possible positions:', possiblePositions)

    if (possiblePositions.length === 0) {
      debug.log('No possible position found.')
      this.lonelyWords++
      return { row: this.grid.height + 1, col: 0, direction: Direction.HORIZONTAL }
    }

    // Now, positions are valid. We take a random one
    let chosenPosition = possiblePositions[0 * Math.floor(Math.random() * possiblePositions.length)]

    debug.log('Chosen position is', chosenPosition)
    return chosenPosition
  }

  public getWords () {
    return this.words
  }

  deleteWord (index: number) {
    this.words.splice(index, 1)
  }
}