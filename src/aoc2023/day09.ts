import '../common'
import util from 'node:util';
let input: string = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

input = readInput('./aoc2023/input09')

class Sequence {
	nums: number[]
	constructor(nums: number[]) {
		this.nums = nums
	}
	isNullSequence() {
		return this.nums.every(n=>n==0)
	}
	predictPreviousValue(): number {
		const diffSeq: Sequence[] = this.computeDifferenceSequences()
		let predictedValue = 0
		for (let i=diffSeq.length-1; i>=0; i--) {
			const diff = diffSeq[i].nums[0]
			predictedValue = diff - predictedValue
		}
		return predictedValue
	}
	predictNextValue(): number {
		const diffSeq: Sequence[] = this.computeDifferenceSequences()
		let predictedValue = 0
		for (let i=diffSeq.length-1; i>=0; i--) {
			const diff = diffSeq[i].nums.slice(-1)[0]
			predictedValue = predictedValue + diff
		}
		return predictedValue
	}
	computeDifferenceSequences(): Sequence[] {
		let ret: Sequence[] = []
		let currentSeq: Sequence = this

		ret.push(this)
		while (!currentSeq.isNullSequence()) {
			currentSeq = currentSeq.computeDifferenceSequence()
			ret.push(currentSeq)
		}
		return ret
	}
	computeDifferenceSequence(): Sequence {
		const ret: number[] = []
		for (let i=1; i<this.nums.length; i++) {
			ret.push(this.nums[i]-this.nums[i-1])
		}
		return new Sequence(ret)
	}
}

function part1(input: string) {
    const sequences = input.split("\n").map(line => new Sequence(line.split(/\s+/).map(n=>+n)))
    const predicted = sequences.map(s => s.predictNextValue())
    console.log(predicted.sum())
}

function part2(input: string) {
    const sequences = input.split("\n").map(line => new Sequence(line.split(/\s+/).map(n=>+n)))
    const predicted = sequences.map(s => s.predictPreviousValue())
    console.log(predicted.sum())
}

part2(input)