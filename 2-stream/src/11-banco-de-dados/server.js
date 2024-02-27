import http from 'node:http'
import {json} from './middleware/json.js'

import {routes} from './routes.js'

/*
    Query Parameters
        parametros nomeados que enviamos na propria url da requisição
        enviado pela url
        não pode enviar informações sensiveis, a url não é criptografada
        ex: GET http://localhost:3333/users?userId=1&name=felcam
        URL Statefull
        ex: caso de uso, alguem compartilha uma pagina filtrada ou paginada, dado não-obrigatórios e não sensiveis
    Route Parameters
        parametros não nomeados
        enviado pela url
        não pode enviar informações sensiveis, a url não é criptografada
        ex: GET http://localhost:3333/users/1
        utlizado para identificação de recursos geralmente
    Request Body
        envio de informações de um formulário
        passa pelo protocolo (HTTPs) mais dificil de ser interceptado e descripttografado
*/

const server = http.createServer(async (req,res) => {
    const {method, url} = req

    await json(req,res)

    const route = routes.find(route => {
        return route.method == method && route.path.test(url)
    })

    if(route) {
        //executa a regex na rota para extrair os route paramns
        const routeParams = req.url.match(route.path)
        req.params = {...routeParams.groups}

        return route.handler(req, res)
    }

    if(route){
        route.handler(req,res)
    }
    
    return res.writeHead(404).end('ERROR 404')
})

server.listen(3333)