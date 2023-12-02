import '../common';

let input: string = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

input = readInput('./aoc2023/input01');

type Mapper = {
  [key: string]: number;
};
const mapper: Mapper = {
      "1":1,
      "2":2,
      "3":3,
      "4":4,
      "5":5,
      "6":6,
      "7":7,
      "8":8,
      "9":9,
      "one":1,
      "two":2,
      "three":3,
      "four":4,
      "five":5,
      "six":6,
      "seven":7,
      "eight":8,
      "nine":9
    };

const words: string[] = ["one","two","three","four","five","six","seven","eight","nine"];
const numbers: string[] = ["1","2","3","4","5","6","7","8","9"];
function findFirstNumber(line: string, numbers: string[]):number {
  let firstWord = "";
  let occ:number = NaN;
  numbers.forEach(word => {
    let occWord = line.indexOf(word);
    if (occWord > -1) {
      if (occWord < occ || Number.isNaN(occ)) {
        occ = occWord;
        firstWord = word;
      }
    }
  });
  return mapper[firstWord];
}

function findLastNumber(line: string, numbers: string[]):number {
  let lastWord = "";
  let occ:number = NaN;
  numbers.forEach(word => {
    let occWord = line.lastIndexOf(word);
    if (occWord > -1) {
      if (occWord > occ || Number.isNaN(occ)) {
        occ = occWord;
        lastWord = word;
      }
    }
  });
  return mapper[lastWord];
}

function part1(input: string) {
  const sum = input.split("\n")
  .map(line => [findFirstNumber(line, numbers),findLastNumber(line, numbers)])
  .map(([first, last]) => first*10+last)
  .sum();
  console.log(sum);
}

function part2(input: string) {
  const sum = input.split("\n")
  .map(line => [findFirstNumber(line, [...words, ...numbers]),findLastNumber(line, [...words, ...numbers])])
  .map(([first, last]) => first*10+last)
  .sum();
  console.log(sum);
}

part2(input);
