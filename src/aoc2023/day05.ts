import '../common'

let input: string = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

input = readInput('./aoc2023/input05')

class Range {
    low: bigint
    high: bigint
    constructor(low: bigint, high: bigint) {
        this.low = low
        this.high = high
    }
    contains(source: bigint) {
        return source >= this.low && source <= this.high
    }
    inspect(depth: any, opts: any) {
        return `Range(${this.low}, ${this.high})`
    }
    overlaps(other: Range) {
        return (this.low >= other.low && this.low <= other.high) || (this.high >= other.low && this.high <= other.high)
             ||(other.low >= this.low && other.low <= this.high) || (other.high >= this.low && other.high <= this.high)
    }
    minus(other: Range): Range[] {
        let ret: Range[] = []
        // 1. no overlap
        if ((this.high < other.low) || (this.low > other.high)) {
            ret = [new Range(this.low, this.high)]
        }
        // 2. other overlaps beginning
        if ((this.low >= other.low && this.low <= other.high) && this.high > other.high) {
            ret = [new Range(other.high + 1n, this.high)]
        }
        // 3. other overlaps end
        if ((this.high >= other.low && this.high <= other.high) && this.low < other.low) {
            ret = [new Range(this.low, other.low - 1n)]
        }
        // 4. other overlaps middle
        if (this.low < other.low && this.high > other.high) {
            ret = [new Range(this.low, other.low - 1n), new Range(other.high + 1n, this.high)]
        }
        // 5. other fully overlaps
        if (other.low <= this.low && other.high >= this.high) {
            // empty range
        }
        return ret
    }
    overlap(other: Range) {
        let ret: Range[] = []
        // 1. no overlap
        if ((this.high < other.low) || (this.low > other.high)) {
            ret = []
        }
        // 2. other overlaps beginning
        if ((this.low >= other.low && this.low <= other.high) && this.high > other.high) {
            ret = [new Range(this.low, other.high)]
        }
        // 3. other overlaps end
        if ((this.high >= other.low && this.high <= other.high) && this.low < other.low) {
            ret = [new Range(other.low, this.high)]
        }
        // 4. other overlaps middle
        if (this.low < other.low && this.high > other.high) {
            ret = [new Range(other.low, other.high)]
        }
        // 5. other fully overlaps
        if (other.low <= this.low && other.high >= this.high) {
            ret = [new Range(this.low, this.high)]
        }
        return ret
    }
    translate(offset: bigint): any {
        return new Range(this.low + offset, this.high + offset)
    }
}

class RangeMap {
    range: Range
    offset: bigint
    constructor(range: Range, offset: bigint) {
        this.range = range
        this.offset = offset
    }
    contains(source: bigint) {
        return this.range.contains(source)
    }
    inspect(depth: any, opts: any) {
        return `RangeMap(${this.range}, ${this.offset})`
    }
}

class RangesMapper {
    rangeMaps: RangeMap[]
    links: RangesMapper[]
    constructor(rangeMaps: RangeMap[]) {
        this.rangeMaps = rangeMaps
        this.links = []
    }
    link(other: RangesMapper) {
        this.links.push(other)
    }
    lookup(source: bigint): bigint {
        let ret = source
        this.rangeMaps.forEach(rm => {
            if (rm.contains(source)) {
                ret = source + rm.offset
                return false
            }
        })
        this.links.forEach(l => {
            ret = l.lookup(ret)
        })
        return ret
    }
    rangeLookup(sourceRanges: Range[]) {
        let ret: Range[] = []
        let inputs: Range[] = []

        // find overlaps
        sourceRanges.forEach(sr => {
            let newOverlapRanges: Range[] = []
            let newMinusRanges: Range[] = [sr]
            this.rangeMaps.forEach(rm => {
                if (sr.overlaps(rm.range)) {
                    newMinusRanges = newMinusRanges.flatMap(mr => {
                        let re: Range[] = []
                        const minus = mr.minus(rm.range)
                        if (minus.length) {
                            re = minus
                        }
                        return re
                    })
                    
                    const overlap = sr.overlap(rm.range)
                    if (overlap.length) {
                        newOverlapRanges = newOverlapRanges.concat(overlap.map(o => o.translate(rm.offset)))
                    }
                }
            })
            inputs = inputs.concat(newMinusRanges).concat(newOverlapRanges)
        })
        
        ret = inputs
        
        this.links.forEach(l => {
            ret = l.rangeLookup(inputs)
        })

        return ret
    }
}

function parseRangeMapper(mapLines: string[]): RangesMapper[] {
    const rangesMapper = mapLines.map(line => line.trim().split(":")[1].trim().split("\n")
        .map(l => l.split(" ").map(n => +n))
        .map(([target, source, length]) => new RangeMap(new Range(BigInt(source), BigInt(source) + BigInt(length) - BigInt(1)), BigInt(target) - BigInt(source))))
        .map(rangeMaps => new RangesMapper(rangeMaps))
    for (let i = 1; i < rangesMapper.length; i++) {
        const before = rangesMapper[i - 1]
        const after = rangesMapper[i]
        before.link(after)
    }
    return rangesMapper
}

function part1(input: string) {
    const [seedsLine, ...mapLines] = input.split("\n\n");
    const seeds: bigint[] = seedsLine.split(":")[1].trim().split(" ").map(n => BigInt(n))
    const rangeMapper = parseRangeMapper(mapLines)
    const locations = seeds.map(seed => rangeMapper[0].lookup(seed))
    console.log(locations.min())
}

function part2(input: string) {
    const [seedsLine, ...mapLines] = input.split("\n\n");
    const seeds: bigint[] = seedsLine.split(":")[1].trim().split(" ").map(n => BigInt(n))
    const rangeMapper = parseRangeMapper(mapLines)
    const seedRanges = []
    for (let i = 0; i < seeds.length / 2; i++) {
        const seedRange = new Range(seeds[i * 2], seeds[i * 2] + seeds[i * 2 + 1] - 1n)
        seedRanges.push(seedRange)
    }
    const ranges = rangeMapper[0].rangeLookup(seedRanges)
    // find lowest in ranges...
    console.log(ranges.map(r => r.low).min())
}

part2(input)