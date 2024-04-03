import supertest from 'supertest'
import { execSync } from 'node:child_process'
import { beforeEach, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '../app'

describe("User's routes", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await supertest(app.server)
      .post('/users')
      .send({
        name: 'felcam',
        email: 'felcam@gmail.com',
      })
      .expect(201)
  })
})
