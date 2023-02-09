window.h0xtyueiifhbc_TestIsFinish = false;

try {
    window.h0xtyueiifhbc = h0xtyueiifhbcChange;
} catch {
    window.h0xtyueiifhbc = new URL(import.meta.url).searchParams.get("path") || new URLSearchParams(window.location.search).get("path");
}

/** @type {string}   */
window.h0xtyueiifhbc;

await import("./browser/start.js") // this call is made from the sub dir (this script is imported on the test.html file)