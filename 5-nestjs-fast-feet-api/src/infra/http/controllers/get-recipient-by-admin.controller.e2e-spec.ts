import { UserRole } from '@/core/enums/enum-user-role'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('get recipient by admin (E2E)', () => {
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
  test('[GET] /recipients/:id', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'John Doe',
        cpf: '12345678900',
        address: '123 Main St',
        latitude: 40.7128,
        longitude: -74.006,
        password: await hash('123456789', 8),
        roles: [UserRole.ADMIN],
      },
    })

    const accessToken = jwt.sign({
      sub: admin.id,
    })

    const recipient = await prisma.user.create({
      data: {
        name: 'Jose',
        cpf: '12345678214',
        address: '777 Main St',
        latitude: 42.7128,
        longitude: -73.006,
        password: await hash('99988833322', 8),
        roles: [UserRole.RECIPIENT],
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/recipients/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        id: recipient.id,
      }),
    })
  })
})
