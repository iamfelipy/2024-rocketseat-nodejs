import { ShipmentStatus } from '@/core/enums/shipment-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { ShipmentFactory } from 'test/factories/make-shipment'

describe('mark as awaiting pickup (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let shipmentFactory: ShipmentFactory
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ShipmentFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    adminFactory = moduleRef.get(AdminFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /shipments/:id/mark-as-awaiting-pickup', async () => {
    const admin = await adminFactory.makePrismaAdmin({})

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const shipment = await shipmentFactory.makePrismaShipment({})

    const response = await request(app.getHttpServer())
      .patch(`/shipments/${shipment.id.toString()}/mark-as-awaiting-pickup`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const shipmentOnDatabase = await prisma.shipment.findFirst({
      where: {
        id: shipment.id.toString(),
      },
    })

    expect(shipmentOnDatabase).toMatchObject({
      status: ShipmentStatus.AWAITING_PICKUP,
    })
  })
})
