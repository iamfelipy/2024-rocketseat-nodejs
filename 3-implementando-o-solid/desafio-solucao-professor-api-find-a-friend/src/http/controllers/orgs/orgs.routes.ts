import { FastifyInstance } from 'fastify'
import { createOrgController } from './create-org.controller'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', createOrgController)
}
