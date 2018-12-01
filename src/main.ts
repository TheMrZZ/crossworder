import Grid from './grid';

let grid = new Grid();

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

grid.addWord('testa');
grid.addWord('etat');
grid.addWord('tarte');
grid.addWord('vente');
grid.addWord('acheter');
grid.addWord('acheter');

displayGrid(grid.asTable());