import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { ShipmentFactory } from 'test/factories/make-shipment'

describe('delete shipment', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let shipmentFactory: ShipmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, ShipmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    shipmentFactory = moduleRef.get(ShipmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[DELETE] /shipments/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const shipment = await shipmentFactory.makePrismaShipment()

    const shipmentId = shipment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const shipmentOnDatabase = await prisma.shipment.findUnique({
      where: {
        id: shipmentId,
      },
    })

    expect(shipmentOnDatabase).toBeFalsy()
  })
})
