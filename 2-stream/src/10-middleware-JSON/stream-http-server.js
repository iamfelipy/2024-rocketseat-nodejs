import http from 'node:http'

import {json} from './middleware/json.js'

const user = []

const server = http.createServer(async (req,res) => {
    const {method, url} = req

    await json(req, res)
    
    if(method == 'GET' && url == '/users') {
        console.log(method,url)

        return res.end(JSON.stringify(user))
    }

    if(method == 'POST' && url == '/users') {
        console.log(method, url)
        const { name, email } = req.body;

        user.push({
            id: 1,
            name,
            email
        })

        return res.writeHead(201).end()
    }

    res.writeHead(404).end();
})

server.listen(3334);