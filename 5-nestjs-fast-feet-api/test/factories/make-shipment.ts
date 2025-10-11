import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Shipment,
  ShipmentProps,
} from '@/domain/core/enterprise/entities/shipment'
import { PrismaShipmentMapper } from '@/infra/database/prisma/mappers/prisma-shipment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeShipment(
  override: Partial<ShipmentProps> = {},
  id?: UniqueEntityID,
) {
  const shipment = Shipment.create(
    {
      recipientId: new UniqueEntityID(),
      courierId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return shipment
}

@Injectable()
export class ShipmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaShipment(data: Partial<ShipmentProps>): Promise<Shipment> {
    const shipment = makeShipment(data)

    await this.prisma.shipment.create({
      data: PrismaShipmentMapper.toPrisma(shipment),
    })

    return shipment
  }
}
