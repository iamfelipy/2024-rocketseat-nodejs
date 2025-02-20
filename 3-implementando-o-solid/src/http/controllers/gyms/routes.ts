import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'
import { search } from './search'
import { nearbyGyms } from './nearby'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', nearbyGyms)
  app.get('/gyms/nearby', search)

  app.post('/gyms', create)
}
