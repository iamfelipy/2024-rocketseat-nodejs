/*
  - criar grupo de teste
  - criar teste isolado
  - carregar os plugins do fastify
  - criar o checkin
  - buscar o checkin
  - teste o conteudo do body e o status code
    app.post('/gyms/:gymId/check-ins', create)
  
*/

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -26.99875078708264,
        longitude: -48.63171675406097,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -26.99875078708264,
        longitude: -48.63171675406097,
      })

    expect(response.statusCode).toEqual(201)
  })
})
