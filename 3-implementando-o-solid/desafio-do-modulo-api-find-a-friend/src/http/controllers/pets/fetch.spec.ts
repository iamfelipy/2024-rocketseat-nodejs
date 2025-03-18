import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Fetch Pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch pets by city', async () => {
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

    await prisma.pet.createMany({
      data: [
        {
          name: 'Buddy',
          age: 3,
          breed: 'Golden Retriever',
          size: 'Large',
          city: 'New York',
          description: 'A very friendly dog',
          org_id: org.id,
        },
        {
          name: 'Max',
          age: 2,
          breed: 'Labrador',
          size: 'Medium',
          city: 'Los Angeles',
          description: 'A playful dog',
          org_id: org.id,
        },
      ],
    })

    const response = await request(app.server).get('/pets?city=New York').send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0].city).toBe('New York')
  })
})
