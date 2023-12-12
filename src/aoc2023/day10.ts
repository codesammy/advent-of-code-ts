import '../common'
import util from 'node:util';
let input: string = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`

input = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`

input = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`

/*
input = `.....
..|..
.-S7.
..||.
..LJ.`
*/

input = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`

input = readInput('./aoc2023/input10')

class PipePiece {
    x: number
    y: number
    connections: PipeConnection[]
    isAnimal: boolean
    isAnimalLoop: boolean
    length!: number
    constructor(x: number, y: number, connections: PipeConnectionDirection[], isAnimal: boolean) {
        this.x = x
        this.y = y
        this.connections = connections.map(dir => new PipeConnection(dir))
        this.isAnimal = isAnimal
        this.isAnimalLoop = false
    }
    computeFarthestPartFromAnimal(): any {
        return Math.ceil(this.length/2)
    }
    resetConnections(): void {
        this.connections.forEach(c => c.assigned = undefined)
    }
    [util.inspect.custom](depth: any, options: any, inspect: any) {
        return `PipePiece(${this.x},${this.y})`
    }
}

enum PipeConnectionDirection {
  North = 1,
  East = 2,
  South = 3,
  West = 4,
}
function opposite(dir: PipeConnectionDirection): PipeConnectionDirection {
    switch (dir) {
        case PipeConnectionDirection.North:
            return PipeConnectionDirection.South;
        case PipeConnectionDirection.East:
            return PipeConnectionDirection.West;
        case PipeConnectionDirection.South:
            return PipeConnectionDirection.North;
        case PipeConnectionDirection.West:
            return PipeConnectionDirection.East;
    }
}

class PipeConnection {
    direction: PipeConnectionDirection
    assigned?: PipePiece
    constructor(direction: PipeConnectionDirection, assigned?: PipePiece) {
        this.direction = direction
        this.assigned = assigned
    }
}

function parsePipePart(char: string, x: number, y: number): PipePiece {
    switch (char) {
        case "|":
            return new PipePiece(x, y, [PipeConnectionDirection.North, PipeConnectionDirection.South], false)
        case "-":
            return new PipePiece(x, y, [PipeConnectionDirection.West, PipeConnectionDirection.East], false)
        case "L":
            return new PipePiece(x, y, [PipeConnectionDirection.North, PipeConnectionDirection.East], false)
        case "J":
            return new PipePiece(x, y, [PipeConnectionDirection.North, PipeConnectionDirection.West], false)
        case "7":
            return new PipePiece(x, y, [PipeConnectionDirection.South, PipeConnectionDirection.West], false)
        case "F":
            return new PipePiece(x, y, [PipeConnectionDirection.South, PipeConnectionDirection.East], false)
        case "S":
            return new PipePiece(x, y, [PipeConnectionDirection.North, PipeConnectionDirection.West, PipeConnectionDirection.South, PipeConnectionDirection.East], true)
        default:
            return new PipePiece(x, y, [], false);
    }
}

function findPipeLoops(pipePieces: PipePiece[]): PipePiece[][] {
    let loops: PipePiece[][] = []
    let foundLoop = false
    pipePieces.forEach(start => {
        if (foundLoop) {
            return
        }
        if (!start.isAnimal) {
            return false
        }
        start.connections.forEach(startConnection => {
            if (foundLoop) {
                return
            }
            console.log("Trying direction", startConnection.direction)
            let count = 0
            let current: PipePiece | undefined = start
            let loop: PipePiece[] = []
            let isAnimalLoop = false
            pipePieces.forEach(pp => pp.resetConnections())
            loops = []
            do {
                if (current.isAnimal) {
                    isAnimalLoop = true;
                }
                if (current == start) {
                    current = connectNextPiece(current, pipePieces, startConnection.direction)
                } else {
                    current = connectNextPiece(current, pipePieces)
                }
                if (!current) {
                    console.log("Could not find next piece", current)
                    return;
                }
                loop.push(current)
                if (current == start) {
                    // store each loop's first piece
                    start.isAnimalLoop = isAnimalLoop
                    start.length = count
                    loops.push(loop)
                    console.log("Found a loop at", current)
                    foundLoop = true
                    return;
                }
                
            } while (count++ < pipePieces.length && !foundLoop)
            console.log("Ran out of pieces at", current)
        })
    })
    return loops
}

function directionToOffset(direction: PipeConnectionDirection) {
    switch (direction) {
        case PipeConnectionDirection.North:
                return {x:0, y:-1}
        case PipeConnectionDirection.East:
                return {x:1, y:0}
        case PipeConnectionDirection.South:
                return {x:0, y:1}
        case PipeConnectionDirection.West:
            default:
                return {x:-1, y:0}
    }
}

function addPosition(a: { x: number; y: number; }, b: { x: number; y: number; }) {
    return {x:a.x + b.x, y:a.y + b.y}
}

function isEqualPosition(a: { x: number; y: number; }, b: { x: number; y: number; }) {
    return a.x == b.x && a.y == b.y
}
    
function connectNextPiece(current: PipePiece, pipePieces: PipePiece[], preferredDirection?: PipeConnectionDirection): PipePiece | undefined {
    const neighborPositions = current.connections.map(c => {
        const offset = directionToOffset(c.direction)
        return addPosition(current, offset)
    })
    
    const neighbors = pipePieces.filter(pp => neighborPositions.some(np => np.x == pp.x && np.y == pp.y))
    //console.log("possible neighbors based on position alone", neighbors)
    // connectors need to fit (north-south, east-west)
    // connectors need to be empty
    // direction need to match the position (y-1 => North, x-1 => west etc.)
    let freeConnections = current.connections.filter(c => !c.assigned)
    
    if (preferredDirection && freeConnections.map(fc=>fc.direction).includes(preferredDirection)) {
        freeConnections = freeConnections.filter(fc => fc.direction == preferredDirection)
    }
    let found = false
    let connectedNeighbor = undefined
    neighbors.forEach(neighbor => {
        if (found) {
            return
        }
        neighbor.connections.forEach(nc => {
            if (found) {
                return
            }
            if (!nc.assigned) {
                freeConnections.forEach(fc => {
                    if (fc.direction == opposite(nc.direction)) {
                        if (isEqualPosition({x:current.x, y:current.y}, addPosition(neighbor, directionToOffset(nc.direction)))) {
                            fc.assigned = neighbor
                            nc.assigned = current
                            connectedNeighbor = neighbor 
                            found = true
                            return
                        }
                    }
                })
            }
        })
    })
    return connectedNeighbor
}

function computeEnclosedArea(animalLoop: PipePiece[], groundPieces: PipePiece[]): any {
    let insideCount = 0
    groundPieces.forEach(gp => {
        let northCount = 0
        let southCount = 0
        for (let i=0; i<gp.x; i++) {
            const pointedAtPiece = animalLoop.find(a => a.x == i && a.y == gp.y)
            const pointedAtPieceIsAnimalLoopPipeNorthSouth = pointedAtPiece && pointedAtPiece.connections.some(c=> c.assigned && [PipeConnectionDirection.North, PipeConnectionDirection.South].includes(c.direction)) 
            if (pointedAtPieceIsAnimalLoopPipeNorthSouth) {
                const dirs = pointedAtPiece.connections.filter(c=>c.assigned).map(c=> c.direction)
                if (dirs.includes(PipeConnectionDirection.North)) {
                    northCount++
                }
                if (dirs.includes(PipeConnectionDirection.South)) {
                    southCount++
                }
            }
        }
        const hitCount = Math.min(northCount, southCount)
        if (hitCount > 0 && hitCount % 2 != 0) {
            insideCount++
        }
    })
    return insideCount
}

function part1(input: string) {
    const pipePieces = input.split("\n").flatMap((line, y) => line.split("").map((char, x) => parsePipePart(char, x, y))).filter(pp => pp.connections.length)
    const pipeLoops = findPipeLoops(pipePieces)
    const animalLoop = pipeLoops.find(loop => loop[0].isAnimalLoop)!
    console.log(animalLoop[0].computeFarthestPartFromAnimal())
}

function part2(input: string) {
    const allPieces = input.split("\n").flatMap((line, y) => line.split("").map((char, x) => parsePipePart(char, x, y)))
    const groundPieces = allPieces.filter(pp => !pp.connections.length)
    const pipePieces = allPieces.filter(pp => pp.connections.length)
    const pipeLoops = findPipeLoops(pipePieces)
    const animalLoop = pipeLoops.find(loop => loop.some(n => n.isAnimalLoop))!
    console.log(computeEnclosedArea(animalLoop, allPieces.filter(p => !animalLoop.includes(p))))
}

part2(input)
