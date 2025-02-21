import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymsBodySchema.parse(request.query)

  const createGymUseCase = makeSearchGymsUseCase()
  const gyms = await createGymUseCase.execute({
    query,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
