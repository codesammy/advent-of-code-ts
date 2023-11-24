declare global {

    interface Array<T> {
        sum(): number;
        transpose(): Array<T>;
    }

    interface String {
        everyNthChar(nth: number): Array<string>;
    }

    function readInput(filename: string): string;
}

if (!Array.prototype.sum) {

    Array.prototype.sum = function (this: number[]) {
        return this.reduce((total, current) => total + current, 0);
    }
}

if (!Array.prototype.transpose) {

    Array.prototype.transpose = function<T>(this: Array<Array<T>>) {
        //console.log(this);
        const a: Array<Array<T>> = [];
        for (let i=0; i<this[0].length; i++) {
            const col: Array<T> = [];
            for (let ii=0; ii<this.length; ii++) {
                col.push(this[ii][i]);
            }
            a.push(col);
        }
        return a;
    }
}

if (!String.prototype.everyNthChar) {

    String.prototype.everyNthChar = function(nth: number): Array<string> {
        //console.log("["+this+"]");
        let a: Array<string> = [];
        for (let i=0; i<(Math.ceil(this.length / nth)); i++) {
            let char = this.charAt(1+i*nth);

            a.push(char);
            //console.log(char, a);
        }
        return a;
    }
}

import * as fs from 'fs';
import path from 'path';

global.readInput = function(filename): string {
    return fs.readFileSync(path.resolve(__dirname, filename)).toString().trimEnd();
}
