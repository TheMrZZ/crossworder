import {Crossword} from './crossword';

let crossword = new Crossword(25);

for (let i = 0; i < 25; i++) {
    crossword.addWord("Abracadabrant");
    crossword.generate();
}

crossword.generate();

console.table(crossword.getGrid());