"use strict";
function doSomething(x) {
    x = 'x-' + x;
    return function (y) {
        y = 'y-' + x;
        return function (z) {
            return z = 'z-' + y;
        };
    };
}
console.log(doSomething('a')('b')('c'));
