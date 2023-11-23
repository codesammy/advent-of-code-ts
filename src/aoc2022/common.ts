declare global {

    interface Array<T> {
        sum(): number;
    }

    function readInput(filename: string): string;
}

if (!Array.prototype.sum) {

    Array.prototype.sum = function (this: number[]) {
        return this.reduce((total, current) => total + current, 0);
    }
}

import * as fs from 'fs';
import path from 'path';

global.readInput = function(filename) {
    return fs.readFileSync(path.resolve(__dirname, filename)).toString().trim();
}
