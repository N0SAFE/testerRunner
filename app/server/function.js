const path = require("path");
const fs = require('fs')

function hasCycle(graph, key) {
    const visited = new Set();
    const stack = new Set();

    function dfs(key) {
        if (visited.has(key)) {
            return false;
        }

        visited.add(key);
        stack.add(key);

        if (graph[key] && Array.isArray(graph[key])) {
            for (let item of graph[key]) {
                if (stack.has(item) || dfs(item)) {
                    return true;
                }
            }
        }

        stack.delete(key);

        return false;
    }

    return dfs(key);
}

const readdirSync = (p, a = []) => {
    if (fs.statSync(p).isDirectory()) fs.readdirSync(p).map(f => readdirSync(a[a.push(path.join(p, f)) - 1], a));
    return a;
};

function transformPathWebToFile(p) {
    p = p.replace("file:///", "").replace(/\\/g, "/");
    return p.charAt(0).toUpperCase() + p.slice(1);
}

function transformPathFileToWeb(p) {
    p = p.replace(/\\/g, "/");
    p = p.charAt(0).toUpperCase() + p.slice(1);
    return "file:///" + p;
}

function isArray(a) {
    return Array.isArray(a);
}

function isObject(o) {
    return typeof o === "object" && o !== null;
}

function isBoolean(b) {
    return typeof b === "boolean";
}

function isNumber(n) {
    return typeof n === "number";
}

module.exports = {
    hasCycle,
    readdirSync,
    transformPathFileToWeb,
    transformPathWebToFile,
    isArray,
    isObject,
    isBoolean,
    isNumber
};
