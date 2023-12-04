import '../common'

let input: string = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

input = readInput('./aoc2023/input03')

class Cell {
    label:string
    x:number
    y:number
    constructor(label:string, x:number, y:number) {
        this.label = label
        this.x = x
        this.y = y
    }
    getNeighbors(cells: Cell[]): Cell[] {
        return cells.filter(cell => this.isNeighbor(cell))
    }
    isPartNumber(cells: Cell[]) {
        const neighbors = this.getNeighbors(cells)
        const symbolNeighbors = neighbors.filter(cell=>isNaN(+cell.label))
        return symbolNeighbors.length
    }
    getPossibleNeighborCoords() {
        const possibleNeighborCoords = []
        for (let i=0; i< this.label.length; i++) {
            if (i == 0) {
                possibleNeighborCoords.push([this.x -1, this.y -1])
                possibleNeighborCoords.push([this.x -1, this.y])
                possibleNeighborCoords.push([this.x -1, this.y +1])
            }
            if (i == this.label.length - 1) {
                possibleNeighborCoords.push([this.x +this.label.length, this.y -1])
                possibleNeighborCoords.push([this.x +this.label.length, this.y])
                possibleNeighborCoords.push([this.x +this.label.length, this.y +1])
            }
            possibleNeighborCoords.push([this.x +i, this.y -1])
            possibleNeighborCoords.push([this.x +i, this.y +1])
        }
        return possibleNeighborCoords;
    }
    isNeighbor(other: Cell) {
        const possibleNeighborCoords = this.getPossibleNeighborCoords()
        const otherPossibleNeighborCoords = other.getPossibleNeighborCoords()
        const otherIsMyNeighbor = !!possibleNeighborCoords.filter(c => c[0] == other.x && c[1] == other.y).length
        const iAmOthersNeighbor = !!otherPossibleNeighborCoords.filter(c => c[0] == this.x && c[1] == this.y).length
        return otherIsMyNeighbor || iAmOthersNeighbor
    }
    computeGearRatio(cells: Cell[]): any {
        let gearRatio = 0
        if (this.label == "*") {
			const partNumbers = this.getNeighbors(cells).filter(x => x.isNumber())
			if (partNumbers.length == 2) {
				gearRatio = (+partNumbers[0].label) * (+partNumbers[1].label)
			}
		}
        return gearRatio
    }
    isNumber(): unknown {
        return !isNaN(+this.label)
    }
}

function parseLine(line: string, lineIndex: number): Cell[] {
	const tokens = line.match(/\d+|[^0-9.]|\.+/g)
	const ret: Cell[] = []
	let index = 0
	tokens?.forEach((x,i) => {
		if (x[0] != ".") {
			ret.push(new Cell(x, index, lineIndex))
		}
		index += x.length
	})
	return ret
}

function part1(input: string) {
  const sum = input.split("\n")
  .flatMap((line, lineIndex) => parseLine(line, lineIndex))
  .filter((cell,_,cells) => cell.isPartNumber(cells))
  .map(cell => +cell.label)
  .filter(num => !isNaN(num))
  .sum()
  console.log(sum)
}

function part2(input: string) {
  const sum = input.split("\n")
  .flatMap((line, lineIndex) => parseLine(line, lineIndex))
  .map((cell, _, cells) => cell.computeGearRatio(cells))
  .sum()
  console.log(sum)
}

part2(input)