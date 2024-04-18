/**
This problem was asked by Jane Street.

cons(a, b) constructs a pair, and car(pair) and cdr(pair) returns the first and last element of that pair. For example, car(cons(3, 4)) returns 3, and cdr(cons(3, 4)) returns 4.

Given this implementation of cons:

def cons(a, b):
    def pair(f):
        return f(a, b)
    return pair
Implement car and cdr.
 */
{
    const cons = (a: unknown, b: unknown) => {
        return [a, b];
    }
    const car = (pair: unknown[]) => {
        return pair[0];
    }
    const cdr = (pair: unknown[]) => {
        return pair[1];
    }

    console.log(car(cons('first', 'second')));
    console.log(cdr(cons('first', 'second')));

}