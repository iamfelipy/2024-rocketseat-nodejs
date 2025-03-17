import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyOrgRole } from '@/http/middlewares/verify-org-role'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.post('/pets', { onRequest: [verifyOrgRole('ADMIN')] }, create)
}
