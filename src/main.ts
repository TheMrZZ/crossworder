import Grid from './grid';

let grid = new Grid(50);

function displayGrid(table: { word: string, wordId: number | null }[][]) {
    for (const row of table) {
        let rowDisplay = '';
        for (const cell of row) {
            if (cell.word === '') {
                rowDisplay += '  ';
            } else {
                rowDisplay += cell.word + ' ';
            }
        }
        console.log(rowDisplay + '\n');
    }
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
console.timeEnd("total");