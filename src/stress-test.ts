import { Crossword } from './crossword'

let crossword = new Crossword(100)

for (let i = 0; i < 50; i++) {
  crossword.addWord(`ABRACADABRANT`)
}

crossword.generate()

console.table(crossword.getGrid().getGrid().map(row => row.map(cell => cell.letter)))