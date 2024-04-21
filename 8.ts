/**
 * Random questions
 * Remove duplicate and sort
 */
{
    const array = [1, 2, 1, 2, 6, 5, 2, 4, 3, 5, 3, 6, 4, 2, 5, 3, 1];
    // const result = [...new Set(array)];
    const n = array.length;
    const result = [array[0]];
    for (let i = 1; i < n; i++) {
        let flag = 0;
        for (let j = 0; j < result.length; j++) {
            if (array[i] === result[j]) {
                flag++;
                break;
            }
        }
        if (flag === 0) {
            result.push(array[i]);
        }
    }

    console.log(result);

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (result[i] > result[j]) {
                [result[i], result[j]] = [result[j], result[i]];
            }
        }
    }


    console.log(result);
}


