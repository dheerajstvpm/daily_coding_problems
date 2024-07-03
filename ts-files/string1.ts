/**
 * Remove white space
 */
let str = ' what  is this ? ';

//#1
const str1 = str.replaceAll(/\s/g, '');
console.log(str1);

//#2
const str2 = str.replaceAll(' ', '');
console.log(str2);

//#3
const arr = str.split(' ');
console.log(arr);
const str3 = str.split(' ').join('');
console.log(str3);
  