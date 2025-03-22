import { FastifyInstance } from 'fastify'

import { createPetController } from '@/http/controllers/pets/create-pet.controller'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { getPetController } from './get-pet.controller'

export async function petsRoutes(app: FastifyInstance) {
  app.post('/orgs/pets', { onRequest: [verifyJwt] }, createPetController)
  app.get('/orgs/pets/:id', getPetController)
}
