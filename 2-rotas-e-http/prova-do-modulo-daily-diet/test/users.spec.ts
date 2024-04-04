import supertest from 'supertest'
import { execSync } from 'node:child_process'
import { beforeEach, describe, it, beforeAll, afterAll, expect } from 'vitest'
import { app } from '../src/app'

describe('Users routes', () => {
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
    const response = await supertest(app.server)
      .post('/users')
      .send({
        name: 'felcam',
        email: 'felcam@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
    /*
      linha 32 testa isso:
      [
        'sessionId=456f8668-88c9-490a-9ae3-4ccdd7deab68; Max-Age=604800; Path=/'
      ]
    */
  })
})
