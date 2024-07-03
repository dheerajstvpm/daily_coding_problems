/**
 * Given a mapping of digits to letters (as in a phone number), and a digit string, return all possible letters the number could represent. You can assume each valid number in the mapping is a single digit.

For example if {“2”: [“a”, “b”, “c”], 3: [“d”, “e”, “f”], …} then “23” should return [“ad”, “ae”, “af”, “bd”, “be”, “bf”, “cd”, “ce”, “cf"].
 */


type DigitToLetters = { [key: number]: string[] };

function letterCombinations(mapping: DigitToLetters, digits: string): string[] {
  if (digits.length === 0) {
    return [""]; // Base case: empty string has one combination (empty string)
  }

  const firstDigit = digits[0];
  const remainingDigits = digits.substring(1);
  const lettersForFirstDigit = mapping[parseInt(firstDigit, 10)]; // Get letters for first digit

  if (!lettersForFirstDigit) {
    // Invalid digit, no combinations possible
    return [];
  }

  const combinationsFromRest = letterCombinations(mapping, remainingDigits);

  // Combine letters from first digit with combinations from remaining digits
  const allCombinations: string[] = [];
  for (const letter of lettersForFirstDigit) {
    for (const combination of combinationsFromRest) {
      allCombinations.push(letter + combination);
    }
  }

  return allCombinations;
}

// Example usage
const mapping: DigitToLetters = {
  2: ["a", "b", "c"],
  3: ["d", "e", "f"],
};

const combinations = letterCombinations(mapping, "232");
console.log(combinations); // Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
