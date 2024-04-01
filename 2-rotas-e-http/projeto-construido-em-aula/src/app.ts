import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

// uma forma de criar rotas em outros arquivos
app.register(transactionsRoutes, {
  prefix: 'transactions',
})
