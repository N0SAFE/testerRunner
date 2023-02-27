export function resolve(location, path){
    try{
        return new URL(path).href
    }catch{
        return new URL(location + "/../" + path).href
    }
}