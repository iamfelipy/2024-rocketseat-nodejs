import fastify from 'fastify'

import { env } from './env'
import { usersRoutes } from './routes/users.routes'
import cookie from '@fastify/cookie'
import { mealsRoutes } from './routes/meals.routes'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(mealsRoutes, {
  prefix: '/meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running!')
  })