pathModuleTest("./chain1.js");

await importNeed([["./chain2.browser.test.js", "chain2"]]);

main(()=>{})