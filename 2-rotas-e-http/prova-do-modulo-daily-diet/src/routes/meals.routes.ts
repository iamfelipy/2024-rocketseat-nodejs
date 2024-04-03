import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { meals } from '../datatmp/datatmp'
import { randomUUID } from 'node:crypto'

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

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      // buscar refeições do usuario mais recentes

      const mealsFilteredList = meals.filter(
        (meal) => meal.user_id === request.user!.id,
      )

      return reply.send({
        meals: [...mealsFilteredList],
      })
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsSchema.parse(request.params)

      const meal = meals.find(
        (v) => v.id === mealId && v.user_id === request.user!.id,
      )

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      return reply.send({
        meal,
      })
    },
  )

  app.put(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const paramsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
        request.body,
      )

      const mealIndex: number = meals.findIndex(
        (meal) => meal.id === mealId && meal.user_id === request.user!.id,
      )

      if (!mealIndex) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      const mealUpdated = {
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      }

      meals[mealIndex] = {
        ...meals[mealIndex],
        ...mealUpdated,
      }

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsScheama = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsScheama.parse(request.params)

      const mealIndex = meals.findIndex(
        (meal) => meal.id === mealId && meal.user_id === request.user!.id,
      )

      if (mealIndex === -1) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      meals.splice(mealIndex, 1)

      return reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const totalMealsOnDiet = meals.reduce((accumulator, meal) => {
        if (meal.is_on_diet) {
          return (accumulator += 1)
        }
        return accumulator
      }, 0)

      const totalMealsOffDiet = meals.reduce((accumulator, meal) => {
        if (!meal.is_on_diet) {
          return (accumulator += 1)
        }
        return accumulator
      }, 0)

      const totalMeals = [...meals]

      const { bestOnDietSequence } = totalMeals.reduce(
        (accumulator, meal) => {
          if (meal.is_on_diet) {
            accumulator.currentSequence += 1
          } else {
            accumulator.currentSequence = 0
          }

          if (accumulator.currentSequence > accumulator.bestOnDietSequence) {
            accumulator.bestOnDietSequence = accumulator.currentSequence
          }

          return accumulator
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet,
        totalMealsOffDiet,
        bestOnDietSequence,
      })
    },
  )
}
