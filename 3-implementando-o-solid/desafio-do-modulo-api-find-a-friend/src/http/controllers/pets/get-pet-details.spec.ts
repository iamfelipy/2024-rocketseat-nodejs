import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Pet Details (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet details', async () => {
    const org = await prisma.org.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
        address: '',
        whatsapp: '',
        role: 'ADMIN',
      },
    })

    const pet = await prisma.pet.create({
      data: {
        name: 'Buddy',
        age: 3,
        breed: 'Golden Retriever',
        size: 'Large',
        city: 'New York',
        description: 'A very friendly dog',
        org_id: org.id,
      },
    })

    const response = await request(app.server).get(`/pets/${pet.id}`).send()

    expect(response.status).toBe(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: pet.id,
        name: 'Buddy',
        age: 3,
        breed: 'Golden Retriever',
      }),
    )
  })
})
