import fastify from 'fastify'

import { env } from './env'

const app = fastify()

app.get('/users', () => {
  return {
    user: 'teste',
  }
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
