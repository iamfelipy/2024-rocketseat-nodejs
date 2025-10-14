import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Shipment,
  ShipmentProps,
} from '@/domain/core/enterprise/entities/shipment'
import { PrismaShipmentMapper } from '@/infra/database/prisma/mappers/prisma-shipment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { makeRecipient } from './make-recipient'
import { makeCourier } from './make-courier'
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper'
import { PrismaCourierMapper } from '@/infra/database/prisma/mappers/prisma-courier-mapper'

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

  async makePrismaShipment(
    data: Partial<ShipmentProps> = {},
  ): Promise<Shipment> {
    const recipient = await this.prisma.user.create({
      data: PrismaRecipientMapper.toPrisma(makeRecipient()),
    })

    const courier = await this.prisma.user.create({
      data: PrismaCourierMapper.toPrisma(makeCourier()),
    })

    const shipment = makeShipment({
      ...data,
      recipientId: data.recipientId ?? new UniqueEntityID(recipient.id),
      courierId: data.courierId ?? new UniqueEntityID(courier.id),
    })

    await this.prisma.shipment.create({
      data: PrismaShipmentMapper.toPrisma(shipment),
    })

    return shipment
  }
}
