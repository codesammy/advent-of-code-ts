declare global {

    interface Array<T> {
        min(): number;
        max(): number;
        sum(): number;
        prod(): number;
        transpose(): Array<T>;
        unique(): boolean;
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

if (!Array.prototype.min) {

    Array.prototype.min = function (this: number[]) {
        return this.reduce((min, current) => min < current ? min : current);
    }
}

if (!Array.prototype.max) {

    Array.prototype.max = function (this: number[]) {
        return this.reduce((max, current) => max > current ? max : current);
    }
}

if (!Array.prototype.prod) {

    Array.prototype.prod = function (this: number[]) {
        return this.reduce((prod, current) => prod * current);
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

if (!Array.prototype.unique) {
    
    Array.prototype.unique = function<T>(this: Array<T>) {
        return this.length == [...new Set(this)].length;
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
