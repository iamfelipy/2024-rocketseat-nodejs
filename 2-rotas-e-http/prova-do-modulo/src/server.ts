import fastify from 'fastify'

const app = fastify()

app.get('/users', () => {
  return {
    user: 'teste',
  }
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
