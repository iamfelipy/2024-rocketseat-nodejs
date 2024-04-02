import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

interface Meal {
  id: string
  user_id: string
  name: string
  description: string
  is_on_diet: boolean
  date: number
  created_at: string
  updated_at: string
}

const meals: Meal[] = [
  {
    id: randomUUID(),
    user_id: '1',
    name: 'café da manha',
    description: 'saladinha',
    is_on_diet: true,
    date: new Date().getTime(),
    created_at: String(new Date().getTime()),
    updated_at: String(new Date().getTime()),
  },
]

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body,
      )

      meals.push({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.user!.id,
        created_at: String(new Date().getTime()),
        updated_at: String(new Date().getTime()),
      })

      return reply.status(201).send()
    },
  )
}
