console.log(await depend(["./1.browser.test.js", "1", ["moduleBrowserTest.module", "other", "chain1"]])) // it will start the await for the test 1.browser.test.js
// ou
// const {
//     "1": {moduleBrowserTest, other, chain1},
// } = depend({path: "./1.browser.test.js", name: "1", import: ["moduleBrowserTest", "other", "chain1"]}) // it will start the await for the test 1.browser.test.js

// moduleBrowserTest         // it contain an object of the module loaded by the test ./test.browser.test.js ({"module": [moduleObject], "module2": [ModuleObject]})
// other                     // it is the test loaded by the test 1.browser.test.js
// chain1                    // it is the test laoded from 1.browser.test.js with the use method