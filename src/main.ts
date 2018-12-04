/*import Grid from './grid';

let grid = new Grid(50);

function displayGrid(table: { word: string, wordId: number | null }[][]) {
    console.table(table.map(row => row.map(cell => cell.word)));
}

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

grid.addWord('eau');
grid.addWord('attaque');
grid.addWord('vendre');
grid.addWord('attraper');

console.time("total");
displayGrid(grid.asTable());
console.timeEnd("total");*/

import Crossword from './crossword';

console.time("total");
let crossword = new Crossword(50);

crossword.addWord('eau');
crossword.addWord('attaque');
crossword.addWord('vendre');
crossword.addWord('attraper');

console.timeEnd("total");