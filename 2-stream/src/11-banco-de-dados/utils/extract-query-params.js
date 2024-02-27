// ['search=Felcam','page=2']
export function extractQueryParamns(query) {
    return query.substr(1).split('&').reduce((queryParamns, param)=>{
        const [key, value] = param.split('=')

        queryParamns[key] = value
        return queryParamns
    },{})
}