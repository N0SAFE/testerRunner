// in module.browser.test.js

depend(["./module.js", "module"], ["./module2.js", "module2"])

main()

// in 1.browser.test.js

depend(["./module.browser.test.js", "moduleBrowserTest"], ["./other.js", "other"]) // this script is loaded everytime

use(["./chain1.js", "chain1"]); // this script is not loaded in a first way

main(()=>{
    // you can call your toBeImportable if the script is contained on the use function
})

// in 2.browser.test.js

const {
    "1": [moduleBrowserTest, other, chain1],
} = depend(["./1.browser.test.js", "1", ["moduleBrowserTest", "other", "chain1"]]) // it will start the await for the test 1.browser.test.js
// ou 
const {
    "1": [moduleBrowserTestp, otherp, chain1p],
} = depend({path: "./1.browser.test.js", name: "1", import: ["moduleBrowserTest", "other", "chain1"]}) // it will start the await for the test 1.browser.test.js

moduleBrowserTest // it contain an object of the module loaded by the test ./test.browser.test.js ({"module": [moduleObject], "module2": [ModuleObject]})
other // it is the test loaded by the test 1.browser.test.js
chain1 // it is the test laoded from 1.browser.test.js with the use method

// with that you can have a hierarchy