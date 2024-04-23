"use strict";
const n = 5;
for (let i = 0; i < n; i++) {
    let str = '';
    for (let j = 0; j < n; j++) {
        if (i === j) {
            str += `${j + 1} `;
        }
        else {
            str += `  `;
        }
    }
    console.log(str);
}
