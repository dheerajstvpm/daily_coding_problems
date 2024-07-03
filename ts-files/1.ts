/**
This problem was recently asked by Google.

Given a list of numbers and a number k, return whether any two numbers from the list add up to k.

For example, given [10, 15, 3, 7] and k of 17, return true since 10 + 7 is 17.

Bonus: Can you do this in one pass?
 */
{
    const arr = [10, 15, 3, 7];
    const k = 17;
    let result = false;

    // for (let i = 0; i < arr.length - 1; i++) {
    //     for (let j = i + 1; j < arr.length; j++) {
    //         if (arr[i] + arr[j] === k) {
    //             result = true;
    //             break;
    //         }
    //     }
    // }
    // console.log(result);

    const complement = new Set();

    arr.forEach(item => {
        if (complement.has(k - item)) {
            result = true;
            return;
        }
        complement.add(item)
    })

    console.log(result);


}