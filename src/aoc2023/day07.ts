import '../common'
import util from 'node:util';
let input: string = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

input = readInput('./aoc2023/input07')

class Card {
    symbol: string
    value: number
    constructor(symbol: string, value: number) {
        this.symbol = symbol
        this.value = value
    }
}

class Hand {
    cards: Card[]
    score: number
    symbolToValue: StrToNumMap
    constructor(cards: Card[], joker: boolean, symbolToValue: StrToNumMap) {
        this.cards = cards
        this.score = this.computeScore(this.cards, symbolToValue, joker)
        this.symbolToValue = symbolToValue
    }
    computeScore(cards: Card[], symbolToValue: StrToNumMap, joker: boolean): number {
        let handTypeRank = 0
        const handRank = this.computeHandRank(cards)
        if (joker && cards.some(card => card.symbol == "J")) {
            const possibleHands = this.generateJokerHands(cards, symbolToValue)
            const possibleHandRanks = possibleHands.map(possibleCards => this.computeHandTypeRank(possibleCards))
            handTypeRank = possibleHandRanks.max()
        } else {
            handTypeRank = this.computeHandTypeRank(cards)
        }
        // 14 * 20**4 = 2240000
        return handTypeRank * 2240000 + handRank
    }
    generateJokerHands(cards: Card[], symbolToValue: StrToNumMap): Card[][] {
        const alternativeSymbols = Object.keys(symbolToValue).filter(sym => sym != "J")
        const jokerHands = alternativeSymbols.map(jokerReplacement => cards.map(card => card.symbol == "J" ? new Card(jokerReplacement, symbolToValue[jokerReplacement]) : card))
        return jokerHands
    }
    computeCardDistibution(cards: Card[]): StrToNumMap {
        const cardDistibution: StrToNumMap = {}
        cards.forEach(card => {
            cardDistibution[card.symbol] = (cardDistibution[card.symbol] || 0) + 1
        })
        return cardDistibution;
    }
    computeCardCluster(cards: Card[]): NumToStrArrayMap {
        const cardDistibution = this.computeCardDistibution(cards)
        const cardCluster: NumToStrArrayMap = {1:[],2:[],3:[],4:[],5:[]}
        Object.keys(cardDistibution).forEach(sym => {
            const distribution = cardDistibution[sym]
            cardCluster[distribution].push(sym)
        })
        return cardCluster;
    }
    computeHandTypeRank(cards: Card[]) {
        const cardCluster = this.computeCardCluster(cards)
        if (cardCluster[5].length) {
            return 7
        } else if (cardCluster[4].length) {
            return 6
        } else if (cardCluster[3].length && cardCluster[2].length) {
            return 5
        } else if (cardCluster[3].length && !cardCluster[2].length) {
            return 4
        } else if (cardCluster[2].length == 2) {
            return 3
        } else if (cardCluster[2].length == 1 && !cardCluster[3].length) {
            return 2
        } else if (cardCluster[1].length == 5) {
            return 1
        }
        return 0
    }
    computeHandRank(cards: Card[]) {
        return this.cards.map((card, i) => card.value * Math.pow(20, this.cards.length - i - 1)).sum()
    }
    [util.inspect.custom](depth: any, options: any, inspect: any) {
        return `Hand(${this.cards.map(card => card.symbol).join("")}, ${this.score})`
    }
}

class HandBid {
    hand: Hand
    bid: number
    constructor(hand: Hand, bid: number) {
        this.hand = hand
        this.bid = bid
    }
    [util.inspect.custom](depth: any, options: any, inspect: any) {
        return `HandBid(${util.inspect(this.hand)}, ${this.bid})`
    }
}

type StrToNumMap = {
  [key: string]: number;
};

type NumToStrArrayMap = {
  [key: number]: string[];
};

const symbolToValuePart1: StrToNumMap = {
    A:14, K:13, Q:12, J:11, T:10, 9:9, 8:8, 7:7, 6:6, 5:5, 4:4, 3:3, 2:2
}
const symbolToValuePart2: StrToNumMap = {
    A:14, K:13, Q:12, T:11, 9:10, 8:9, 7:8, 6:7, 5:6, 4:5, 3:4, 2:3, J:2
}

function parseHand(line: string, symbolToValue: StrToNumMap, joker: boolean) {
    const cards = line.split("").map(sym => new Card(sym, symbolToValue[sym]))
    return new Hand(cards, joker, symbolToValue)
}

function parseHandBid(line: string, symbolToValue: StrToNumMap, joker: boolean) {
    const [handLine, bid] = line.split(" ");
    const hand = parseHand(handLine, symbolToValue, joker)
    return new HandBid(hand, +bid)
}

function part1(input: string) {
    const handBids = input.split("\n").map(line => parseHandBid(line, symbolToValuePart1, false));
    handBids.sort((a,b)=>a.hand.score - b.hand.score)
    console.log(handBids.map((x,i)=>x.bid * (i+1)).sum())
}

function part2(input: string) {
    const handBids = input.split("\n").map(line => parseHandBid(line, symbolToValuePart2, true));
    handBids.sort((a,b)=>a.hand.score - b.hand.score)
    console.log(handBids.map((x,i)=>x.bid * (i+1)).sum())
}

part2(input)