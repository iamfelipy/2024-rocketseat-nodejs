import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchPetUseCase } from '@/use-cases/factories/make-fetch-pets-use-case'

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const createPetQuerySchema = z.object({
    city: z.string(),
    name: z.string().optional(),
    age: z.coerce.number().optional(),
    breed: z.string().optional(),
    size: z.string().optional(),
    orgId: z.string().optional(),
  })

  const { city, name, age, breed, size, orgId } = createPetQuerySchema.parse(
    request.query,
  )

  const createPetUseCase = makeFetchPetUseCase()
  const { pets } = await createPetUseCase.execute({
    name,
    age,
    breed,
    size,
    city,
    orgId,
  })

  return reply.status(200).send({ pets })
}
