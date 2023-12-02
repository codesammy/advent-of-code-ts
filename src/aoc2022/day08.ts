import '../common';

let input: string = `30373
25512
65332
33549
35390`;

input = readInput('./aoc2022/input08');

class Grid {
  width: number;
  height: number;
  cells: number[][];
  constructor(cells: number[][]) {
    this.cells = cells;
    this.width = cells[0].length;
    this.height = cells.length;
  }
  getCell(pos: number[]): number {
    return this.cells[pos[1]]?.[pos[0]];
  }
  isVisible(start: number[]): boolean {
    //this.drawMap(start);
    let visible = false;
    const h = this.getCell(start);
    const dirs = [[0, 1],[0, -1],[1, 0],[-1, 0]];
    while (dirs.length) {
      const [dir] = dirs.splice(0,1);
      const pos: number[] = [start[0], start[1]];
      let cell = 0;
      do {
        pos[0] += dir[0];
        pos[1] += dir[1];
        cell = this.getCell(pos);
        if (!cell) {
          visible = true;
          break;
        }
        if (cell >= h) {
          visible = false;
          //this.drawMap(start, pos);
          break;
        }
      } while (cell);
      if (!cell) {
        visible = true;
        break;
      }
    }
    //console.log("visible", visible);
    return visible;
  }
  drawMap(start: number[], inTheWay?: number[]) {
    for (let y=0;y<this.height;y++) {
      for (let x=0;x<this.width;x++) {
        const h = this.getCell([x,y]);
        let char = ` ${h} `;
        if (start[0] == x && start[1] == y) {
          char = `<${h}>`;
        }
        if (inTheWay && inTheWay[0] == x && inTheWay[1] == y) {
          char = `{${h}}`;
        }
        process.stdout.write(char);
      }
      process.stdout.write("\n");
    }
  }
}

function parseGrid(input: string): Grid {
  const grid = input.split("\n")
  .map(line => line.split("").map(x=>+x));
  
  return new Grid(grid);
}

function part1(input: string) {
  const grid = parseGrid(input);
  let visible = 0;
  for (let y=0;y<grid.height;y++) {
    for (let x=0;x<grid.width;x++) {
      if (grid.isVisible([x,y])) {
        visible++;
      }
    }
  }
  console.log(visible);
}

function part2(input: string) {
  
}

part1(input);
