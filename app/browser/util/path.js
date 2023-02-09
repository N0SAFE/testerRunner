export function resolve(...path){
    return new URL(...path.join('./')).href
}