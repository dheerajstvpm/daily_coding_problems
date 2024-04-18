/**
This problem was asked by Stripe.

Given an array of integers, find the first missing positive integer in linear time and constant space. In other words, find the lowest positive integer that does not exist in the array. The array can contain duplicates and negative numbers as well.

For example, the input [3, 4, -1, 1] should give 2. The input [1, 2, 0] should give 3.

You can modify the input array in-place.
 */
{

  function firstMissingPositive(nums: number[]) {
    const n = nums.length;

    // Move all positive integers to the beginning of the array
    let j = 0;
    for (let i = 0; i < n; ++i) {
      if (nums[i] > 0) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        j++;
      }
    }

    // Mark the presence of positive integers by flipping the sign of the corresponding index
    for (let i = 0; i < j; i++) {
      const index = Math.abs(nums[i]) - 1;
      if (index < j) {
        nums[index] = -Math.abs(nums[index]);
      }
    }

    // Find the first positive index whose value is not negative
    for (let i = 0; i < j; i++) {
      if (nums[i] > 0) {
        return i + 1;
      }
    }

    return j + 1;
  }

  // Test cases
  console.log(firstMissingPositive([3, 4, -1, 1])); // Output: 2
  console.log(firstMissingPositive([1, 2, 0]));      // Output: 3
  console.log(firstMissingPositive([5, 6, 8]));      // Output: 1
}