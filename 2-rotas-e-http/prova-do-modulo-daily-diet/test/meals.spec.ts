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
})
