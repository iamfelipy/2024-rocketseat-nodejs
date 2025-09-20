import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { expect, beforeAll, test, describe } from 'vitest'
import request from 'supertest'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      cpf: '12345678900',
      address: '123 Main St',
      latitude: 40.7128,
      longitude: -74.006,
      password: '123456789',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '12345678900',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
