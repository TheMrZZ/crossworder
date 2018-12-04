/*import Grid from './grid';

let grid = new Grid(50);

function displayGrid(table: { word: string, wordId: number | null }[][]) {
    console.table(table.map(row => row.map(cell => cell.word)));
}

grid.addWord('eau');
grid.addWord('etat');
grid.addWord('racine');
grid.addWord('acheter');
grid.addWord('bonsoir');
grid.addWord('deux');
grid.addWord('warning');
grid.addWord('array');

console.time("total");
displayGrid(grid.asTable());
console.timeEnd("total");*/

import Crossword from './crossword';

let crossword = new Crossword();
crossword.addWord("test");
crossword.addWord("tast");