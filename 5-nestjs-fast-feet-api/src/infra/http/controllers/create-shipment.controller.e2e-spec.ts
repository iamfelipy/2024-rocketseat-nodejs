import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserRole } from '@/core/enums/enum-user-role'
import { ShipmentFactory } from 'test/factories/make-shipment'

describe('Create recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let shipmentFactory: ShipmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, ShipmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /shipments', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .post('/shipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const shipmentOnDatabase = await prisma.shipment.findFirst({
      where: {
        recipientId: recipient.id.toString(),
      },
    })

    expect(shipmentOnDatabase).toBeTruthy()
  })

  test('[POST] /recipients - should return 403 if user is not admin', async () => {
    const nonAdmin = await adminFactory.makePrismaAdmin({
      roles: [UserRole.COURIER],
    })

    const accessToken = jwt.sign({
      sub: nonAdmin.id.toString(),
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .post('/shipments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(403)

    const shipmentOnDatabase = await prisma.shipment.findFirst({
      where: {
        recipientId: recipient.id.toString(),
      },
    })

    expect(shipmentOnDatabase).toBeFalsy()
  })
})
