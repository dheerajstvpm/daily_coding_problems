{
    function binarySearch(array: number[], searchItem: number): number {
        let left = 0;
        let right = array.length - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (array[mid] === searchItem) {
                return mid;
            }
            if (array[mid] < searchItem) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
    
    const inArr = [1, 3, 4, 4.7, 6, 8, 11, 14];
    const searchFor = 14;
    const index = binarySearch(inArr, searchFor);
    if (index !== -1) {
        console.log(`${searchFor} found at index ${index}`);
    } else {
        console.log(`${searchFor} not found in the array`);
    }
}