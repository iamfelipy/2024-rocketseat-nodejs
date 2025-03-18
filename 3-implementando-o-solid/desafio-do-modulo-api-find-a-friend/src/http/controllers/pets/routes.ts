import { FastifyInstance } from 'fastify'
import { create } from './create'
import { fetch } from './fetch'
import { verifyOrgRole } from '@/http/middlewares/verify-org-role'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/pets', { onRequest: [verifyJWT, verifyOrgRole('ADMIN')] }, create)
  app.get('/pets', fetch)
}
