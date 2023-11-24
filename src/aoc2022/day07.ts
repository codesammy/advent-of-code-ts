import './common';

let input: string = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

input = readInput('./input07');

class File {
  parent: Directory;
  name: string;
  size: number;
  constructor(name: string, parent: Directory, size: number) {
    this.parent = parent;
    this.name = name;
    this.size = size;
  } 
}

class Directory {
  name: string;
  // root doesn't have a parent
  parent?: Directory;
  files: Array<File>;
  dirs: Array<Directory>;
  constructor(name: string, parent?: Directory) {
    this.name = name;
    this.parent = parent;
    this.files = [];
    this.dirs = [];
  }
  containsFile(name: string) {
    return !!this.getFile(name);
  }
  containsDir(name: string) {
    return !!this.getDir(name);
  }
  getFile(name: string) {
    return this.files.find(f => f.name == name);
  }
  getDir(name: string) {
    return this.dirs.find(d => d.name == name);
  }
  addFile(child: File) {
    this.files.push(child);
  }
  addDir(child: Directory) {
    this.dirs.push(child);
  }
  visit(visitor : (dir: Directory) => void) {
    visitor(this);
    this.dirs.forEach(d => d.visit(visitor));
  }
  size() {
    let sum = this.files.map(f => f.size).sum();
    sum += this.dirs.map(d => d.size()).sum();
    return sum;
  }
}

function parseTree(input: string): Directory {
  const root = new Directory("/");
  let cur = root;
  input.match(/\$ ([a-z]+)(([^$]+))?/gm)!
  .map(lines => lines.trimEnd().split("\n"))
  .map(([commandLine, ...outputLines]) => {
    const [, command, ...args] = commandLine.split(" ");
    if (command == "cd") {
      const dir = args[0];
      if (dir == "/") {
        cur = root;
      } else if (dir == ".." && cur.parent) {
        cur = cur.parent;
      } else {
        if (!cur.containsDir(dir)) {
          const newDir = new Directory(dir, cur);
          cur.addDir(newDir);
        }
        const newDir = cur.getDir(dir);
        if (newDir) {
          cur = newDir;
        }
      }
    } else if (command == "ls") {
      outputLines.forEach(line => {
        const [dirOrSize, name] = line.split(" ");
        if (dirOrSize == "dir") {
          if (!cur.containsDir(name)) {
            const newDir = new Directory(name, cur);
            cur.addDir(newDir);
          }
        } else {
          if (!cur.containsFile(name)) {
            const newFile = new File(name, cur, +dirOrSize);
            cur.addFile(newFile);
          }
        } 
      });
    }
  });
  return root;
}

function part1(input: string) {
  const root = parseTree(input);
  let sum = 0;
  root.visit(dir => {
    const size = dir.size();
    if (size <= 100000) {
      sum += size;
    }
  });
  console.log(sum);
}

function part2(input: string) {
  const root = parseTree(input);
  const needToDeleteSize = 30000000 - (70000000 - root.size());
  const deleteCandidateSizes: number[] = [];
  root.visit(dir => {
    const size = dir.size();
    if (size >= needToDeleteSize) {
      deleteCandidateSizes.push(size);
    }
  });
  deleteCandidateSizes.sort((a,b) => a-b);
  console.log(deleteCandidateSizes[0]);
}

part2(input);
