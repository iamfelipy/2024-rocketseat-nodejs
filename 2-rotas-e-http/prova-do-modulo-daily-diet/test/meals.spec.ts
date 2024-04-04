import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'
import supertest from 'supertest'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send({
        name: 'maik',
        email: 'maik@gmail.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')!

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'cafe da manha',
        description: 'cafe da manha',
        isOnDiet: false,
        date: 1712099607234,
      })
      .expect(201)
  })
  it('should be able to list all meals from a user', async () => {
    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send({
        name: 'felcam',
        email: 'felcam@gmail.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')!

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: true,
        date: new Date(Date.now() * 24 * 60 * 60 * 1000), // 1 day after
      })
      .expect(201)

    const listMealsResponse = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toHaveLength(2)

    // this validate if the order is correct
    expect(listMealsResponse.body.meals[0].name).toBe('Breakfast')
    expect(listMealsResponse.body.meals[1].name).toBe('Lunch')
  })
  it('should be able to show a single meal', async () => {
    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send({
        name: 'jamaica',
        email: 'jamaica@gmail.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')!

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(Date.now() * 24 * 60 * 60 * 1000), // 1 day after
      })
      .expect(201)

    const listMealsResponse = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const mealResponse = await supertest(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(mealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: 'Breakfast',
        description: "It's a breakfast",
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    })
  })
  it('should be able to update a meal from a user', async () => {
    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send({
        name: 'paulo',
        email: 'paulo@gmail.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')!

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: 'Apple, milk and cookies',
        isOnDiet: false,
        date: Date.now() + 60 * 60,
      })
      .expect(201)

    const listMealsResponse = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await supertest(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast updated',
        description: 'bread, mean and rice',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(204)

    // const mealResponse = await supertest(app.server)
    //   .get(`/meals/${mealId}`)
    //   .set('Cookie', cookies)
    //   .expect(200)

    // expect(mealResponse.body).toEqual({
    //   meal: expect.objectContaining({
    //     name: 'Breakfast updated',
    //     description: 'bread, mean and rice',
    //     is_on_diet: 1,
    //     date: expect.any(Number),
    //   }),
    // })
  })
  it('should be able to delete a meal from a user', async () => {
    const userResponse = await supertest(app.server)
      .post('/users')
      .send({
        name: 'bruno',
        email: 'bruno@gmail.com',
      })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')!

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Dinner',
        description: 'beans, rice and means',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const listMealsResponse = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await supertest(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
  it.only('shoud be able to get metrics from a user', async () => {
    const createUserResponse = await supertest(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')!

    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date('2021-01-01T08:00:00'),
      })
      .expect(201)
    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: false,
        date: new Date('2021-01-01T12:00:00'),
      })
      .expect(201)
    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Snack',
        description: "It's a snack",
        isOnDiet: true,
        date: new Date('2021-01-01T15:00:00'),
      })
      .expect(201)
    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Dinner',
        description: "It's a dinner",
        isOnDiet: true,
        date: new Date('2021-01-01T20:00:00'),
      })
      .expect(201)
    await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date('2021-01-02T08:00:00'),
      })
      .expect(201)

    const getMetricsResponse = await supertest(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsResponse.body).toEqual(
      expect.objectContaining({
        totalMeals: 5,
        totalMealsOnDiet: 4,
        totalMealsOffDiet: 1,
        bestOnDietSequence: 3,
      }),
    )
  })
})
