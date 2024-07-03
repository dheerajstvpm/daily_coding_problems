"use strict";
/**
This problem was asked by Uber.

Given an array of integers, return a new array such that each element at index i of the new array is the product of all the numbers in the original array except the one at i.

For example, if our input was [1, 2, 3, 4, 5], the expected output would be [120, 60, 40, 30, 24]. If our input was [3, 2, 1], the expected output would be [2, 3, 6].

Follow-up: what if you can't use division?
 */
{
    const arr = [1, 2, 3, 4, 5];
    const result = [];
    // for (let i = 0; i < arr.length; i++) {
    //     let j = 0;
    //     let product = 1;
    //     for (let j = 0; j < arr.length; j++) {
    //         if (j === i) {
    //             continue;
    //         }
    //         product *= arr[j];
    //     }
    //     result.push(product);
    // }
    // total = arr.reduce((curr, prev) => curr = curr * prev, 1);
    // arr.forEach(item => result.push(total / item));
    let left = 1;
    for (let i = 0; i < arr.length; i++) {
        result.push(left);
        left *= arr[i];
    }
    let right = 1;
    for (let j = arr.length - 1; j > -1; j--) {
        result[j] *= right;
        right *= arr[j];
    }
    console.log(result);
}
