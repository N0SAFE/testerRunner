console.log(await depend(["./module.browser.test.js", "moduleBrowserTest"], ["./other.js", "other"])) // this script is loaded everytime

use(["./chain1.js", "chain1"]); // this script is not loaded in a first way

main(()=>{
    // you can call your toBeImportable if the script is contained on the use function
})