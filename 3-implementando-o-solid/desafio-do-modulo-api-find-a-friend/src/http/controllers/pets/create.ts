import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    age: z.coerce.number(),
    breed: z.string(),
    size: z.string(),
    city: z.string(),
    description: z.string(),
    orgId: z.string(),
  })

  const { name, age, breed, size, city, description, orgId } =
    createPetBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()
  await createPetUseCase.execute({
    name,
    age,
    breed,
    size,
    city,
    description,
    orgId,
  })

  return reply.status(201).send()
}
