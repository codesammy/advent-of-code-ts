import '../common'
import util from 'node:util';
let input: string = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

input = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

input = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

input = readInput('./aoc2023/input08')

class TreeNode {
    name: string
    left?: TreeNode
    right?: TreeNode
    constructor(name: string) {
        this.name = name
    }
    link(left: TreeNode, right: TreeNode) {
        this.left = left
        this.right = right
    }
    [util.inspect.custom](depth: any, options: any, inspect: any) {
        return `TreeNode(${this.name})`
    }
}

type Tree = {
  [key: string]: TreeNode;
};

function parseTreeNode(line: string, tree: Tree) {
    const [source, left, right] = line.match(/[A-Z0-9]{3}/g)!.map(name => {
        const node: TreeNode = tree[name] || new TreeNode(name);
        tree[name] = node
        return node;
    })
    source.link(left, right)
    return source
}

class Distance {
    begin: TreeNode
    end: TreeNode
    steps: number
    constructor(begin: TreeNode, end: TreeNode, steps: number) {
        this.begin = begin
        this.end = end
        this.steps = steps
    }
}

class PrimeFactor {
    num: number
    exp: number
    constructor(num: number, exp: number) {
        this.num = num
        this.exp = exp
    }
}

function computeDistances(navigation: Array<string>, startingNode: TreeNode) {
    const distances: Distance[] = [];
    let steps = 0
    let protect = 1000000
    let current: TreeNode = startingNode
    let path: string[] = []
    do {
        path = path.concat(navigation)
        path.forEach(lr => {
            if (current.name.endsWith("Z")) {
                if (distances.map(d => d.end.name).includes(current.name)) {
                    protect = 0
                    return false;
                } else {
                    distances.push(new Distance(startingNode, current, steps))
                }
            }
            if (lr == "L") {
                current = current.left || current
            } else if (lr == "R") {
                current = current.right || current
            }
            steps++
        })
    } while (protect-- > 0)
    return distances
}

function getSmallestPrimeFactor(num: number) {
    for (let i=2; i<num; i++) {
        if (num % i == 0) {
            return i
        }
    }
    return 1
}

function factorize(num: number) {
    const ret: PrimeFactor[] = []
    for ( let f = 0; f != 1; num = num / f){
        f = getSmallestPrimeFactor(num)
        if (f == 1) {
            ret.push(new PrimeFactor(num, 1))
            break;
        }
        const pf = ret.find(p => p.num == f) || new PrimeFactor(f, 0)
        if (pf.exp == 0) {
            ret.push(pf)
        }
        pf.exp++
        
    }
    return ret
}

function lowestCommonMultiple(factors: PrimeFactor[]) {
    const unique = factors.filter((v,i,a) => a.map(pf => pf.num).indexOf(v.num) == i)
    return unique.map(u => new PrimeFactor(u.num, factors.filter(f => f.num == u.num).map(f => f.exp).max())).map(pf => Math.pow(pf.num, pf.exp)).prod() 
}

function part1(input: string) {
    const navigation = input.split("\n")[0].split("")
    const tree: Tree = {}
    const treeNodes = input.split("\n").slice(2).map(line => parseTreeNode(line, tree));
    //let current: TreeNode | undefined = treeNodes[0]
    let current: TreeNode | undefined = tree["AAA"]
    let path: string[] = []
    let steps = 0
    do {
        path = path.concat(navigation)
        path.forEach(lr => {
            if (current?.name == "ZZZ") {
                return false;
            }
            if (lr == "L") {
                current = current?.left
            } else if (lr == "R") {
                current = current?.right
            }
            steps++
        })
    } while (current.name != "ZZZ")
    console.log(steps)
}

function part2(input: string) {
    const navigation = input.split("\n")[0].split("")
    const tree: Tree = {}
    const treeNodes = input.split("\n").slice(2).map(line => parseTreeNode(line, tree));
    //let current: TreeNode | undefined = treeNodes[0]
    const startingNodes: TreeNode[] = Object.keys(tree).filter(name => name.endsWith("A")).map(name => tree[name])
    
    const distances: Distance[][] = startingNodes.map(node => computeDistances(navigation, node));
    // special case: all starting nodes only have one goal...
    const primeFactors: PrimeFactor[][] = distances.flatMap(dl => dl.map(distance => factorize(distance.steps)))
    
    console.log(lowestCommonMultiple(primeFactors.flatMap(x => x)))
}

part2(input)