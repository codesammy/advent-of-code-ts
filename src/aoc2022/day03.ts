import './common';

let input: string = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

input = readInput('./input03');

class Rucksack {
  compartments: string[];
  constructor(lines: string[]) {
    this.compartments = lines;
  }
  common(): string {
    for (let i=0; i<this.compartments[0].length;i++) {
      let item = this.compartments[0][i];
      let itemContainedInAllCompartments = true;
      for (let ii = 1; ii < this.compartments.length; ii++) {
        if (!this.compartments[ii].includes(item)) {
          itemContainedInAllCompartments = false;
        }
      }
      if (itemContainedInAllCompartments) {
        return item;
      }
    }
    throw new Error("No common item found!");
  }
}

function priority(item: string) {
  if ("a".charCodeAt(0) <= item.charCodeAt(0) && item.charCodeAt(0) <= "z".charCodeAt(0)) {
    return item.charCodeAt(0) - "a".charCodeAt(0) + 1;
  } else {
    return item.charCodeAt(0) - "A".charCodeAt(0) + 27;
  }
}

function part1(input: string) {
  let sum = input.split("\n")
  .map(line => [line.substring(0, line.length / 2), line.substring(line.length / 2)])
  .map(items => new Rucksack(items))
  .map(rs => rs.common())
  .map(item => priority(item))
  .sum();
  console.log(sum);
}

function part2(input: string) {
  let sum = input.split('\n')
  .reduce((acc: Array<Array<string>>, e) => {
    if (acc[acc.length-1].length < 3) {
      acc[acc.length-1].push(e);
    } else {
      acc.push([e]);
    }
    return acc;
    }, [[]])
  .map(items => new Rucksack(items))
  .map(rs => rs.common())
  .map(item => priority(item))
  .sum();
  console.log(sum);
}

part2(input);
