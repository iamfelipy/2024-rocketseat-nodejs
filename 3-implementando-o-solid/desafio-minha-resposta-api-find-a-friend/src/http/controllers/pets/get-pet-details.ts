import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case'

export async function getPetDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getPetDetailsParamSchema = z.object({
    petId: z.string(),
  })

  const { petId } = getPetDetailsParamSchema.parse(request.params)

  const getPetDetailsUseCase = makeGetPetDetailsUseCase()
  const { pet } = await getPetDetailsUseCase.execute({
    petId,
  })

  return reply.status(200).send({ pet })
}
