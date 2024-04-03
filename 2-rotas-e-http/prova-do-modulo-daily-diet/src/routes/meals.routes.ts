import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

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

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.user!.id,
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
      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      return reply.send({
        meals,
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
      const meal = await knex('meals')
        .where({ id: mealId, user_id: request.user?.id })
        .first()

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

      const meal = await knex('meals')
        .where({
          id: mealId,
          user_id: request.user?.id,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      await knex('meals')
        .where({ id: mealId, user_id: request.user?.id })
        .update({
          name,
          description,
          is_on_diet: isOnDiet,
          date: date.getTime(),
        })

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

      const meal = await knex('meals')
        .where({ id: mealId, user_id: request.user?.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found.' })
      }

      await knex('meals')
        .where({
          id: mealId,
          user_id: request.user?.id,
        })
        .del()

      return reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const totalMealsOnDiet = await knex('meals')
        .where({
          user_id: request.user?.id,
          is_on_diet: true,
        })
        .count('id', { as: 'total' })
        .first()

      const totalMealsOffDiet = await knex('meals')
        .where({
          user_id: request.user?.id,
          is_on_diet: false,
        })
        .count('id', {
          as: 'total',
        })
        .first()

      const totalMeals = await knex('meals')
        .where({
          user_id: request.user?.id,
        })
        .orderBy('date', 'desc')

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
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence,
      })
    },
  )
}
