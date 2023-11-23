import './common';

let input: string = `A Y
B X
C Z`;

input = readInput('./input02');

class Shape {
  name: string;
  value: number;
  inferior: Shape;
  superior: Shape;
  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
    this.inferior = this;
    this.superior = this;
  }
  setInferior(shape: Shape): void {
    this.inferior = shape;
  }
  setSuperior(shape: Shape): void {
    this.superior = shape;
  }
  compare(other: Shape): number {
    if (this.value == other.value) {
      return 0;
    } else if (this.inferior == other) {
      return 1;
    } else {
      return -1;
    }
  }
}

let ROCK = new Shape("Rock", 1);
let PAPER = new Shape("Paper", 2);
let SCISSORS = new Shape("Scissors", 3);
ROCK.setSuperior(PAPER);
ROCK.setInferior(SCISSORS);
PAPER.setSuperior(SCISSORS);
PAPER.setInferior(ROCK);
SCISSORS.setSuperior(ROCK);
SCISSORS.setInferior(PAPER);

function parseChar(char: string) {
  if (char == "A" || char == "X") {
    return ROCK;
  } else
  if (char == "B" || char == "Y") {
    return PAPER;
  } else
  if (char == "C" || char == "Z") {
    return SCISSORS;
  } else {
    throw new Error(`Parameter "char" was unexpected: "${char}"`);
  }
}

function parseCharStrategy(char: string, shape: Shape) {
  let parsed:Shape = shape;
  if (char == "X") {
    parsed = shape.inferior;
  } else
  if (char == "Y") {
    parsed = shape;
  } else
  if (char == "Z") {
    parsed = shape.superior;
  } else {
    throw new Error(`Parameter "char" was unexpected: "${char}"`);
  }
  //console.log("strategy ", char , " against " , shape , " is countered with " , parsed);
  return parsed;
}

class Round {
  elf: Shape;
  me: Shape;
  constructor(elf: Shape, me: Shape) {
    this.elf = elf;
    this.me = me;
  }
  score(): number {
    let score = this.me.value;
    if (this.me.compare(this.elf) == -1) {
      score += 0;
    } else if (this.me.compare(this.elf) == 1) {
      score += 6;
    } else {
      score += 3;
    }
    return score;
  }
}

function silver(input: string) {
  let rounds:Round[] = input.split("\n")
  .map(line => line.split(" "))
  .map(shapes => new Round(parseChar(shapes[0]), parseChar(shapes[1])));

  let totalScore:number = rounds
  .map(round => round.score())
  .sum();
  console.log(totalScore);
}

function gold(input: string) {
  let rounds:Round[] = input.split("\n")
  .map(line => line.split(" "))
  .map(shapes => {let elfShape = parseChar(shapes[0]); return new Round(elfShape, parseCharStrategy(shapes[1], elfShape))});

  let totalScore:number = rounds
  .map(round => round.score())
  .sum();
  console.log(totalScore);
}

gold(input);
