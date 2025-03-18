import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create new Pet', async () => {
    const { token } = await createAndAuthenticateOrg(app, true)

    const org = await prisma.org.findFirstOrThrow()

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        age: 3,
        breed: 'Golden Retriever',
        size: 'Large',
        city: 'New York',
        description: 'A very friendly dog',
        orgId: org.id,
      })

    expect(response.statusCode).toEqual(201)
  })
})
