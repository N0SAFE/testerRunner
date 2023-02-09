// in test.browser.js

depend("./test.js")

main()

// in 1.js

depend("./test.browser.js", "./other.js") // this script is loaded everytime

importNeed("./chain1.js"); // this script is not loaded in a first way

main(()=>{
    // you can call your toBeImportable if the script is contained on the importNeed function
})

// in 2.js

const {
    "./1.js": [testBrowser, other],
} = depend(["./1.js", ["./test.browser.js", "./other.js"]]) // it will start the await for the test 1.js

testBrowser // it contain an object of the module loaded by the test ./test.browser.js ({./test.js})
other // it is the test loaded by the test 1.js 

//  with that you can have a hierarchy