import { PaginationParams } from '@/core/repositories/pagination-params'
import { ShipmentsRepository } from '@/domain/core/application/repositories/shipments-repository'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaShipmentMapper } from '../mappers/prisma-shipment-mapper'
import { ShipmentAttachmentsRepository } from '@/domain/core/application/repositories/shipment-attachments-repository'

@Injectable()
export class PrismaShipmentsRepository implements ShipmentsRepository {
  constructor(
    private prisma: PrismaService,
    private shipmentAttachmentsRepository: ShipmentAttachmentsRepository,
  ) {}

  findManyNearbyAssignedShipmentsForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    params: PaginationParams,
  ): Promise<Shipment[]> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<Shipment | null> {
    const shipment = await this.prisma.shipment.findUnique({
      where: {
        id,
      },
    })

    if (!shipment) {
      return null
    }

    return PrismaShipmentMapper.toDomain(shipment)
  }

  async findMany({ page }: PaginationParams): Promise<Shipment[]> {
    const shipments = await this.prisma.shipment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return shipments.map(PrismaShipmentMapper.toDomain)
  }

  async create(shipment: Shipment): Promise<void> {
    const data = PrismaShipmentMapper.toPrisma(shipment)

    await this.prisma.shipment.create({
      data,
    })
  }

  async save(shipment: Shipment): Promise<void> {
    const data = PrismaShipmentMapper.toPrisma(shipment)

    await Promise.all([
      this.prisma.shipment.update({
        where: {
          id: shipment.id.toString(),
        },
        data,
      }),
      this.shipmentAttachmentsRepository.createMany(
        shipment.attachments.getNewItems(),
      ),
      this.shipmentAttachmentsRepository.deleteMany(
        shipment.attachments.getRemovedItems(),
      ),
    ])
  }

  async delete(shipment: Shipment): Promise<void> {
    await this.prisma.shipment.delete({
      where: {
        id: shipment.id.toString(),
      },
    })
  }

  async findAssignedShipmentForCourier(
    courierId: string,
    shipmentId: string,
  ): Promise<Shipment | null> {
    const courierShipment = await this.prisma.shipment.findFirst({
      where: {
        courierId,
        id: shipmentId,
      },
    })

    if (!courierShipment) {
      return null
    }

    return PrismaShipmentMapper.toDomain(courierShipment)
  }
}
