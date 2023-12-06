import '../common'

let input: string = `Time:      7  15   30
Distance:  9  40  200`

input = readInput('./aoc2023/input06')

function computeTotalWins(times: number[], distances: number[]) {
    const totalWins = times.map((totalTime,i)=>{
        const recordDistance = distances[i]
        return [...Array(totalTime)].map((_,buttonPressTime)=>{
            const speed = buttonPressTime + 1
            const travelTime = totalTime - speed
            return travelTime * speed
        }).filter(n=>n>recordDistance)
        .length
    })
    return totalWins
}

function part1(input: string) {
    const [timeLine, distanceLine] = input.split("\n");
    const times = timeLine.split(":")[1].trim().split(/ +/).map(n=>+n)
    const distances = distanceLine.split(":")[1].trim().split(/ +/).map(n=>+n)
    const totalWins = computeTotalWins(times, distances)
    console.log(totalWins.prod())
}

function part2(input: string) {
    const [timeLine, distanceLine] = input.split("\n");
    const time = +timeLine.split(":")[1].replace(/ +/g, "")
    const distance = +distanceLine.split(":")[1].replace(/ +/g, "")
    const p = -time
    const q = distance
    const pq1 = -(p/2)
    const pq2 = Math.sqrt(Math.pow(p/2, 2) - q)
    const lowestWin = Math.ceil(pq1 - pq2)
    const highestWin = Math.floor(pq1 + pq2)
    console.log(Math.abs(highestWin-lowestWin+1))
}

part2(input)