import '../common'
import util from 'node:util';
let input: string = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

input = readInput('./aoc2023/input11')

class GridItem {
    x:number
    y:number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    [util.inspect.custom](depth: any, options: any, inspect: any) {
        return `GridItem(${this.x},${this.y})`
    }
}

class GridPath {
    from: GridItem
    to: GridItem
    constructor(from: GridItem, to: GridItem) {
        this.from = from
        this.to = to
    }
    computeLength(): number {
        return Math.abs(this.from.x-this.to.x) + Math.abs(this.from.y-this.to.y)
    }
    [util.inspect.custom](depth: any, options: any, inspect: any) {
        return `GridPath(${util.inspect(this.from)}, ${util.inspect(this.to)}, ${this.computeLength()})`
    }
}

class Galaxy extends GridItem {
    constructor(x: number, y: number) {
        super(x, y)
    }
    [util.inspect.custom](depth: any, options: any, inspect: any) {
        return `Galaxy(${this.x},${this.y})`
    }
}

function parseSymbol(symbol: string, x: number, y: number) {
    if (symbol == "#") {
        return new Galaxy(x, y)
    }
    return undefined
}

function expandSpace(galaxies: Galaxy[], expansionFactor: number) {
    const horizontals: number[] = []
    const verticals: number[] = []
    const xs = galaxies.map(g => g.x)
    const ys = galaxies.map(g => g.y)

    // special case, galaxies are always at the edges
    for (let i=xs.min(); i<=xs.max(); i++) {
        if (!xs.includes(i)) {
            horizontals.push(i)
        }
    }
    for (let i=ys.min(); i<=ys.max(); i++) {
        if (!ys.includes(i)) {
            verticals.push(i)
        }
    }
    
    galaxies.forEach(g => {
        g.x += horizontals.filter(h => g.x > h).length * expansionFactor
        g.y += verticals.filter(v => g.y > v).length * expansionFactor
    })
}

function permutateAllGalaxyPaths(galaxies: Galaxy[]) {
    const paths = []
    for (let i=0; i<galaxies.length-1; i++) {
        for (let j=i+1; j<galaxies.length; j++) {
            paths.push(new GridPath(galaxies[i], galaxies[j]))
        }
    }
    return paths
}

function printGalaxies(galaxies: Galaxy[]) {
    for (let y=0; y<=galaxies.map(g=>g.y).max(); y++) {
        for (let x=0; x<=galaxies.map(g=>g.x).max(); x++) {
            let sym = "."
            if (galaxies.some(g => g.x == x && g.y == y)) {
                sym = "#"
            }
            process.stdout.write(sym);
        }
        process.stdout.write("\n");
    }
}

function part1(input: string) {
    const galaxies: Galaxy[] = []
    input.split("\n").forEach((line, y) => {
        line.split("").forEach((symbol, x) => {
            if (symbol == "#") {
                galaxies.push(new Galaxy(x, y))
            }
        })
    })
    expandSpace(galaxies, 1)
    //printGalaxies(galaxies)
    const paths = permutateAllGalaxyPaths(galaxies)
    console.log(paths.map(p => p.computeLength()).sum())
}

function part2(input: string) {
    const galaxies: Galaxy[] = []
    input.split("\n").forEach((line, y) => {
        line.split("").forEach((symbol, x) => {
            if (symbol == "#") {
                galaxies.push(new Galaxy(x, y))
            }
        })
    })
    expandSpace(galaxies, 999999)
    const paths = permutateAllGalaxyPaths(galaxies)
    console.log(paths.map(p => p.computeLength()).sum())
}

part2(input)
