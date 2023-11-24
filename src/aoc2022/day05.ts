import './common';

let input: string = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

input = readInput('./input05');

class Stack {
  num: number;
  // ordering from bottom to top
  crates: string[];
  constructor(num: number, crates: string[]) {
    this.num = num;
    this.crates = crates;
  }
  addTop(crates: string[]) {
    this.crates.push(...crates);
  }
  removeTop(amount: number): string[] {
    return this.crates.splice(-amount, amount);
  }
}

class Operation {
  num: number;
  source: number;
  target: number;
  constructor(num: number, source: number, target: number) {
    this.num = num;
    this.source = source;
    this.target = target;
  }
}

class Crane {
  constructor() {
  }
  moveStacks(stacks: Array<Stack>, ops: Array<Operation>) {
    ops.forEach(op => {
      [...Array(op.num)].map(_ => {
        stacks[op.target-1].addTop( stacks[op.source-1].removeTop(1) );
      });
      //console.log(stacks);
    });
    
    return stacks;
  }
  moveStacksMultiMode(stacks: Array<Stack>, ops: Array<Operation>) {
    ops.forEach(op => {
      //console.log(stacks);
      stacks[op.target-1].addTop( stacks[op.source-1].removeTop(op.num) );
      //console.log(op);
      //console.log(stacks);
    });
    
    return stacks;
  }
}

function silver(input: string) {
  const [stackLines, operationLines] = input.split("\n\n");
  const stacks:Array<Stack> = stackLines.split("\n")
  .map(line => line.everyNthChar(4))
  .transpose()
  .map(topToBottom => topToBottom.reverse())
  .map(([num, ...crates]) => new Stack(+num, crates.filter(x => x.trim())));
  //console.log(stacks);

  const ops:Array<Operation> = operationLines.split("\n")
  .map(line => /move (.+) from (.+) to (.+)/.exec(line)!)
  .map(([,num, source, target]) => new Operation(+num, +source, +target));
  //console.log(ops);
  
  const crane = new Crane();
  const stacksMoved = crane.moveStacks(stacks, ops);
  console.log(stacksMoved.map(s => s.removeTop(1)[0]).join(""));
}

function gold(input: string) {
  const [stackLines, operationLines] = input.split("\n\n");
  const stacks:Array<Stack> = stackLines.split("\n")
  .map(line => line.everyNthChar(4))
  .transpose()
  .map(topToBottom => topToBottom.reverse())
  .map(([num, ...crates]) => new Stack(+num, crates.filter(x => x.trim())));
  //console.log(stacks);

  const ops:Array<Operation> = operationLines.split("\n")
  .map(line => /move (.+) from (.+) to (.+)/.exec(line)!)
  .map(([,num, source, target]) => new Operation(+num, +source, +target));
  //console.log(ops);
  
  const crane = new Crane();
  const stacksMoved = crane.moveStacksMultiMode(stacks, ops);
  console.log(stacksMoved.map(s => s.removeTop(1)[0]).join(""));
}

gold(input);
