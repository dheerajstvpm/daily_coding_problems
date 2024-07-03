/**
 * Convert M1I1S2I1S2I1P2I1 to MISSISSIPPI
 */


function converter(stringToConvert: string): string {
    let convertedString = '';
    let subString = '';
    for (let i = 0; i < stringToConvert.length; ++i) {
        if (/\d/.test(stringToConvert[i])) {
            convertedString += subString.repeat(Number(stringToConvert[i]));
            subString = '';
        } else {
            subString += stringToConvert[i];
        }
    }
    return convertedString;
}

console.log(converter(`M1I1S2I1S2I1P2I1`));