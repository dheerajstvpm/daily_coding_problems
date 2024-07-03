1/**
This problem was asked by Facebook.

Given the mapping a = 1, b = 2, ... z = 26, and an encoded message, count the number of ways it can be decoded.

For example, the message '111' would give 3, since it could be decoded as 'aaa', 'ka', and 'ak'.

You can assume that the messages are decodable. For example, '001' is not allowed.
 */

function numDecodings(message: string) {
    // Handle empty or invalid messages
    if (!message || message[0] === "0") {
        return 0;
    }

    const n = message.length;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1; // Empty string has 1 way to decode

    // Fill dp table based on DP relation
    for (let i = 1; i <= n; i++) {
        const currentDigit = parseInt(message[i - 1]);
        const prevDigit = parseInt(message[i - 2] || '0');

        // Single digit decoding
        if (currentDigit >= 1 && currentDigit <= 9) {
            dp[i] = dp[i - 1];
        }

        // Double digit decoding (handle leading zero)
        if (prevDigit >= 1 && prevDigit <= 2 && currentDigit <= 6) {
            dp[i] += dp[i - 2];
        }
    }

    return dp[n]; // Number of decodings for entire message
}

// Example usage
const message1 = "111";
const message2 = "001";
const message3 = "12";
const message4 = "1111";

console.log(numDecodings(message1)); // Output: 3 aaa,ak,ka
console.log(numDecodings(message2)); // Output: 0 (invalid message)
console.log(numDecodings(message3)); // Output: 2
console.log(numDecodings(message4)); // Output: 5 aaaa,aak,aka,kaa,kk