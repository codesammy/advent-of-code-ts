import '../common'

let input: string = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

input = readInput('./aoc2023/input04')

type StrNumMap = {
	[key: string]: number;
};

type NumericalMap = {
	[key: number]: number;
};

class Card {
	num: number
	winning: number[]
	mine: number[]
	constructor(num: number, winning: number[], mine: number[]) {
		this.num = num
		this.winning = winning
		this.mine = mine
	}
	getWinningNumbers() {
		return this.winning.filter(n => this.mine.includes(n))
	}
	computePoints(): number {
		let points = 0
		const myWinningNumbers = this.getWinningNumbers()
		if (myWinningNumbers.length) {
			points = Math.pow(2, myWinningNumbers.length - 1)
		}
		return points
	}
}

function parseLine(line: string): Card {
	const num = +(line.split(":")[0].split(/ +/)[1])
	const [winning, mine] = line.split(":")[1].split("|").map(nums => nums.trim().split(/ +/).map(x => +x))
	return new Card(num, winning, mine)
}

function part1(input: string) {
	const sum = input.split("\n")
		.map(line => parseLine(line))
		.map(card => card.computePoints())
		.sum()
	console.log(sum)
}

function part2(input: string) {
	let copies: NumericalMap = {}
	let cards: Card[] = input.split("\n")
		.map(line => parseLine(line))
	cards.forEach(card => {
		copies[card.num] = 1
	})
	cards.forEach(card => {
		card.getWinningNumbers().map((n, i) => card.num + i + 1).forEach(cardNum => {
			cards.filter(c => c.num == cardNum)
				.forEach(wonCard => {
					[...Array(copies[card.num])].forEach(_ => {
						copies[wonCard.num] = copies[wonCard.num] + 1
					})
				})
		})
	})
	const sum = Object.values(copies).sum()
	console.log(sum)
}

part2(input)