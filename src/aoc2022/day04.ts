import '../common';

let input: string = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

input = readInput('./aoc2022/input04');

class Range {
  low: number;
  high: number;
  constructor(range: string) {
    [this.low, this.high] = range.split("-").map(x => parseInt(x));
  }
  fullyContains(other:Range): boolean {
    return this.low <= other.low && this.high >= other.high;
  }
  overlaps(other:Range): boolean {
    return (other.low <= this.low && this.low <= other.high)
    || (other.low <= this.high && this.low <= other.high);
  }
}

function part1(input: string) {
  let count = input.split("\n")
  .map(line => line.split(","))
  .map(ranges => ranges.map(r => new Range(r)))
  .map(ranges => ranges[0].fullyContains(ranges[1]) || ranges[1].fullyContains(ranges[0]))
  .filter(item => item)
  .length;
  console.log(count);
}

function part2(input: string) {
  let count = input.split("\n")
  .map(line => line.split(","))
  .map(ranges => ranges.map(r => new Range(r)))
  .map(ranges => ranges[0].overlaps(ranges[1]))
  .filter(item => item)
  .length;
  console.log(count);
}

part2(input);
