import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'

describe('Create recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /recipients', async () => {
    // Test for successful recipient creation by admin
    const admin = await prisma.user.create({
      data: {
        name: 'John Doe',
        cpf: '12345678900',
        address: '123 Main St',
        latitude: 40.7128,
        longitude: -74.006,
        password: '123456789',
        roles: ['ADMIN'],
      },
    })

    const accessToken = jwt.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jose',
        cpf: '12345678214',
        address: '777 Main St',
        latitude: 42.7128,
        longitude: -73.006,
        password: '99988833322',
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '12345678214',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })

  test('[POST] /recipients - should return 403 if user is not admin', async () => {
    const nonAdmin = await prisma.user.create({
      data: {
        name: 'Jane Doe',
        cpf: '12345678901',
        address: '456 Main St',
        latitude: 41.7128,
        longitude: -75.006,
        password: '987654321',
        roles: ['COURIER'],
      },
    })

    const accessToken = jwt.sign({
      sub: nonAdmin.id,
    })

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Maria',
        cpf: '12345678215',
        address: '888 Main St',
        latitude: 43.7128,
        longitude: -72.006,
        password: '11122233344',
      })

    expect(response.statusCode).toBe(403)

    const recipientOnDatabase = await prisma.user.findFirst({
      where: {
        cpf: '12345678215',
      },
    })

    expect(recipientOnDatabase).toBeFalsy()
  })

  test('[POST] /recipients - should return 409 if recipient already exists', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        cpf: '12345678902',
        address: '999 Main St',
        latitude: 44.7128,
        longitude: -71.006,
        password: 'adminpassword',
        roles: ['ADMIN'],
      },
    })

    // Create recipient with cpf that will be duplicated
    await prisma.user.create({
      data: {
        name: 'Existing Recipient',
        cpf: '12345678216',
        address: '1000 Main St',
        latitude: 45.7128,
        longitude: -70.006,
        password: 'recipientpassword',
        roles: ['RECIPIENT'],
      },
    })

    const accessToken = jwt.sign({
      sub: admin.id,
    })

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Duplicate Recipient',
        cpf: '12345678216',
        address: '2000 Main St',
        latitude: 46.7128,
        longitude: -69.006,
        password: 'anotherpassword',
      })

    expect(response.statusCode).toBe(409)
  })
})
