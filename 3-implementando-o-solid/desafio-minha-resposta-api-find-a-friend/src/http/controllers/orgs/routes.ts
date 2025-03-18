import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { create } from './create'
import { refresh } from './refresh'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)
  app.post('/orgs', create)
}
