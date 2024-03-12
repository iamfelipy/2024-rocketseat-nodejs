import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)

// exemplo de hook global para todas as rotas
app.addHook('preHandler', async (request, reply) => {
  console.log(`Sou um hook global para todas as rotas.`)
})

// plugin
// uma forma de criar rotas em outros arquivos
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
