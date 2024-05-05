"use strict";
// Define a function that returns a Promise
function myAsyncFunction() {
    return new Promise((res, err) => {
        // Simulating an asynchronous operation (e.g., fetching data)
        setTimeout(() => {
            const randomNumber = Math.random();
            // Resolve the promise if the random number is greater than 0.5
            if (randomNumber > 0.5) {
                res(randomNumber);
            }
            else {
                // Reject the promise if the random number is less than or equal to 0.5
                err(new Error("Random number is too low"));
            }
        }, 1000); // Simulating a delay of 1 second
    });
}
// Using the Promise
const run = async () => {
    try {
        const result = await myAsyncFunction();
        console.log(result);
    }
    catch (error) {
        console.log(error.message);
    }
};
run();
myAsyncFunction()
    .then((result) => {
    console.log("Success:", result);
})
    .catch((error) => {
    console.error("Error:", error.message);
});
