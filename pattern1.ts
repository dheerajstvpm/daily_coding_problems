/**
 * Random questions
 * Square Pattern 1
 */
const n = 5;
for (let i = 0; i < n; i++) {
    let str = '';
    for (let j = 0; j < n; j++) {
        if (i === j) {
            str += `${j + 1} `;
        } else {
            str += `* `;
        }
    }
    console.log(str);
}

for (let i = 0; i < n; i++) {
    let str = '';
    for (let j = 0; j < n; j++) {
        if (i === n-1-j) {
            str += `${j + 1} `;
        } else {
            str += `* `;
        }
    }
    console.log(str);
}