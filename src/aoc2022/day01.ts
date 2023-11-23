import './common';

let input: string = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

input = readInput('./input01');

class Elf {
  calories: number[];
  constructor(calories: number[]) {
    this.calories = calories;
  }
  total(): number {
    return this.calories.sum();
  }
}

function silver(input: string) {
  let elves:Elf[] = input.split("\n\n").map(e => new Elf(e.split("\n").map(x => parseInt(x))) );
  elves.sort((a, b) => b.total() - a.total());
  let maxCarryElf = elves[0];
  console.log(maxCarryElf.total());
}

function gold(input: string) {
  let elves:Elf[] = input.split("\n\n").map(e => new Elf(e.split("\n").map(x => parseInt(x))) );
  elves.sort((a, b) => b.total() - a.total());
  let maxCarryElves = elves.slice(0, 3);
  console.log(maxCarryElves.map(elf => elf.total()).sum());
}

gold(input);
