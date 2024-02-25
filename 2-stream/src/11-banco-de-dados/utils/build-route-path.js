// users/:userid/groups/:groupid
// /\/users\/([a-z0-9\-_]+)\/groups\/([a-z0-9\-_]+)/
// /users/1c70d340-d066-4f9a-bcdb-e84fcb717f4c/groups/3c70d340-a066-4f9a-bcdb-e84fcb717f4c
export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    //retorna um regex iterador, precisa que resultado seja convertido com o Array.from
    // path.matchAll(routeParametersRegex)
    // const matchsFind = Array.from(path.matchAll(routeParametersRegex))
    // console.log(Array.from(path.matchAll(routeParametersRegex)))
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
    // const pathWithParams = path.replaceAll(routeParametersRegex, '(?<id>[a-z0-9\-_]+)')
    // para escapar o hifen preciso usar barra invertida e underline
    // console.log(pathWithParams)
    
    // const regexTwoRouteParams = /\/users\/([a-z0-9\-_]+)\/groups\/([a-z0-9\-_]+)/g
    // const pathTwoRouteParams = '/users/1c70d340-d066-4f9a-bcdb-e84fcb717f4c/groups/3c70d340-a066-4f9a-bcdb-e84fcb717f4c'
    // let test = pathTwoRouteParams.matchAll(regexTwoRouteParams)
    // test = Array.from(pathTwoRouteParams.matchAll(regexTwoRouteParams))
    // console.log("regexTwoRouteParams")
    // console.log(test)
    const pathRegex = new RegExp(`^${pathWithParams}`)
    
    return pathRegex
}

