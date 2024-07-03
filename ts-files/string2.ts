/**
 * Word frequency
 */


{
    const str = 'aaa bbb ccc aaa ccc aaa';
    const wordFrequency: { [key: string]: number } = {}
    const words = str.split(' ');
    for (let word of words) {
        if (wordFrequency[word]) {
            wordFrequency[word]++;
        } else {
            wordFrequency[word] = 1;
        }
    }
    console.log(wordFrequency);

}