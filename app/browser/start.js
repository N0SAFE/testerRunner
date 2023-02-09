import InternalImportError from "./util/logTemplate/InternalImportError.js";
import InternalDoNotExistError from "./util/logTemplate/InternalDoNotExistError.js";
import {ExpectMethods} from './util/jestFunctionReplicate/ExpectMethods/ExpectMethods.js';
import { main } from './util/JestMethods.js'
import { importNeed, pathModuleTest, requiredFiles } from "./util/specialFunction.js";
import iFunc from './util/iFunc.js'
import { cycle } from "./util/bundle.js";

window.main = main;
window.importNeed = importNeed;
window.pathModuleTest = pathModuleTest;
window.requiredFiles = requiredFiles;
window.iFunc = iFunc;
window.ExpectMethods = ExpectMethods;

console.log(window.h0xtyueiifhbc)

window.h0xtyueiifhbc_Started

try {
    const mainWrap = await import(window.h0xtyueiifhbc);
    if (window.h0xtyueiifhbc_Started !== true) {
        if (!window.h0xtyueiifhbc_TestIsFinish) {
            window.h0xtyueiifhbc_TestIsFinish = true;
            h0xtyueiifhbc_Start();
            console.trace("end");
            h0xtyueiifhbc_EndOfFile(JSON.stringify(cycle(mainWrap, { seenType: "linear" }), null, 4));
        }
    }
} catch (e) {
    console.error(e);
    if (!window.h0xtyueiifhbc_TestIsFinish) {
        console.trace("test is finish");
        window.h0xtyueiifhbc_TestIsFinish = true;
        if (await h0xtyueiifhbc_FileExist(window.h0xtyueiifhbc)) {
            h0xtyueiifhbc_ThrowError(
                new InternalImportError("the testModule " + new URL(window.h0xtyueiifhbc).href + " handle a fail", { message: e.message, stack: e.stack, name: e.name }, new URL(window.h0xtyueiifhbc).href)
            );
        } else {
            h0xtyueiifhbc_ThrowError(
                new InternalDoNotExistError("the testModule " + new URL(window.h0xtyueiifhbc).href + " handle a fail", { message: e.message, stack: e.stack, name: e.name }, new URL(window.h0xtyueiifhbc).href)
            );
        }
    }
}
