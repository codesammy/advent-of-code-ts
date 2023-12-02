import '../common';

let input: string = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`;

input = readInput('./aoc2022/input06');

class Device {
  input: string;
  pos: number;
  constructor(input: string) {
    this.input = input;
    this.pos = 0;
  }
  seekToStartMarker(startMarkerLength: number) {
    do {
      this.pos++;
    } while (!this.input.substring(this.pos, this.pos+startMarkerLength).split("").unique());
    this.pos += startMarkerLength;
  }
}

function part1(input: string) {
  const device = new Device(input);
  device.seekToStartMarker(4);
  console.log(device.pos);
}

function part2(input: string) {
  const device = new Device(input);
  device.seekToStartMarker(14);
  console.log(device.pos);
}

part2(input);
