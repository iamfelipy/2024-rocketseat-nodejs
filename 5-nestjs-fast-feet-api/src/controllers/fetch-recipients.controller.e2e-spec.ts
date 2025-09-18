import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Fetch recipients (E2E)', () => {
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

  test('[GET] /recipients', async () => {
    // Create an admin user
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

    // Hash the password before creating the recipient users
    const hashedPassword = await hash('99988833322', 8)

    await prisma.user.createMany({
      data: [
        {
          name: 'Jose',
          cpf: '12345678214',
          address: '777 Main St',
          latitude: 42.7128,
          longitude: -73.006,
          password: hashedPassword,
          roles: ['RECIPIENT'],
        },
        {
          name: 'Anderson',
          cpf: '12345678215',
          address: '777 Main St',
          latitude: 42.7128,
          longitude: -73.006,
          password: hashedPassword,
          roles: ['RECIPIENT'],
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: [
        expect.objectContaining({ name: 'Jose' }),
        expect.objectContaining({ name: 'Anderson' }),
      ],
    })
  })

  test('[GET] /recipients - should return 403 if user is not admin', async () => {
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
      .get('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})
