import Crossword from './crossword';

let crossword = new Crossword(500);

crossword.addWord('eau');
crossword.addWord('attaque');
crossword.addWord('vendre');
crossword.addWord('attraper');

console.time("total");
crossword.generate();
console.timeEnd("total");

console.log('THE BEST CROSSWORD IS...');
console.table(crossword.getGrid().getGrid().map(row => row.map(cell => cell.letter)));