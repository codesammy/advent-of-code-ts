import '../common';

let input: string = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

input = readInput('./aoc2023/input02');

class Game {
    id:number;
    sets:Cubeset[]
    constructor(id:number, sets:Cubeset[]) {
        this.id = id;
        this.sets = sets;
    }
    minimumCubesNeeded():Total {
        return this.sets.map(s=>s.total())
        .reduce((sum,x) => sum.max(x), new Total(0,0,0));
    }
    possible(red:number, green:number, blue:number) {
        let valid = false;
        const total = this.minimumCubesNeeded();
        if (total.red <= red && total.green <= green && total.blue <= blue) {
            valid = true;
        }
        return valid;
    }
    power() {
        const total = this.minimumCubesNeeded();
        return total.red * total.green * total.blue
    }
}

class Cubeset {
    reveals:Reveal[]
    constructor(reveals:Reveal[]) {
        this.reveals = reveals;
    }
    total():Total {
        let reds = 0;
        let greens = 0;
        let blues = 0;
        this.reveals.forEach(x => {
            //console.log("counting reveals per cubeset", x);
            if (x.color == "red") {
                reds += x.count;
            } else
            if (x.color == "green") {
                greens += x.count;
            } else
            if (x.color == "blue") {
                blues += x.count;
            } else {
                throw new Error("unknown color: " + x.color)
            }
        })
        //console.log("total", new Total(reds, greens, blues))
        return new Total(reds, greens, blues);
    }
}

class Reveal {
    count:number
    color:string
    constructor(count:number, color:string) {
        this.count = count;
        this.color = color;
    }
}

class Total {
    red:number
    green:number
    blue:number
    constructor(red:number, green:number, blue:number) {
        this.red = red
        this.green = green
        this.blue = blue
    }
    max(other:Total) {
        return new Total(Math.max(this.red, other.red), Math.max(this.green, other.green), Math.max(this.blue, other.blue))
    }
}

function parseInput(line: string): Game {
    const [gameLine, setsLine] = line.split(":")
    const sets = setsLine.split(";")
    .map(s => s.split(",")
               .map(setLine => setLine.trim().split(" ").map(s=>s.trim()))
               .map(([count, color]) => new Reveal(+count, color))
         )
    .map(reveals => new Cubeset(reveals))
    return new Game(+gameLine.split(" ")[1], sets)
}

function part1(input: string) {
  const sum = input.split("\n")
  .map(line => parseInput(line))
  .filter(game => game.possible(12, 13, 14))
  .map(game => game.id)
  .sum();
  console.log(sum);
}

function part2(input: string) {
  const sum = input.split("\n")
  .map(line => parseInput(line))
  .map(game => game.power())
  .sum();
  console.log(sum);
}

part2(input);
