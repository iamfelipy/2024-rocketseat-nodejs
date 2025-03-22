import { FastifyInstance } from 'fastify'
import { createOrgController } from './create-org.controller'
import { authenticateOrgController } from './authenticate-org.controller'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', createOrgController)
  app.post('/orgs/authenticate', authenticateOrgController)
}
