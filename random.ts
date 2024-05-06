function doSomething(x: string) {
    x = 'x-' + x;
    return function (y: string) {
        y = 'y-' + x;
        return function (z: string) {
            return z = 'z-' + y;
        }
    }
}
console.log(doSomething('a')('b')('c'));
