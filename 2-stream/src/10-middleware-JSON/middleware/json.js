export async function json(req, res){

    //foi criado um unico arquivo que lida tanto com parse json como seta o header content-type para o client saber o tipo de dado retornado
    
    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
        console.log(req.body)
    } catch {
        req.body = null
    }

    res.setHeader('Content-Type', 'application/json')
}