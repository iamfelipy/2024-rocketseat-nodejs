import { PaginationParams } from '@/core/repositories/pagination-params'
import { ShipmentsRepository } from '@/domain/core/application/repositories/shipments-repository'
import { Shipment } from '@/domain/core/enterprise/entities/shipment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaShipmentMapper } from '../mappers/prisma-shipment-mapper'
import { ShipmentAttachmentsRepository } from '@/domain/core/application/repositories/shipment-attachments-repository'
import { ShipmentWithCourierAndRecipient } from '@/domain/core/enterprise/entities/value-objects/shipment-with-courier-recipient'
import { PrismaShipmentWithCourierAndRecipientMapper } from '../mappers/prisma-shipment-with-courier-and-recipient-mapper'
import { ShipmentDetails } from '@/domain/core/enterprise/entities/value-objects/shipment-details'
import { PrismaShipmentDetailsMapper } from '../mappers/prisma-shipment-details-mapper'

import {
  Shipment as PrismaShipment,
  User as PrismaUser,
  ShipmentStatus,
  UserRole,
} from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { DomainEvents } from '@/core/events/domain-events'

type PrismaShipmentWithCourierAndRecipient = PrismaShipment & {
  courier: PrismaUser | null
  recipient: PrismaUser
}

// Tipagem para a saída do queryRaw baseada no schema e SQL:
type RawNearbyShipmentWithCourierAndRecipient = {
  // Campos da tabela shipments
  id: string
  status: ShipmentStatus
  recipient_id: string
  courier_id: string | null
  pickup_date: Date | null
  delivery_date: Date | null
  returned_date: Date | null
  created_at: Date
  updated_at: Date | null

  // Campos do recipient (User)
  recipient_id_user: string
  recipient_cpf: string
  recipient_name: string
  recipient_address: string
  recipient_latitude: Decimal
  recipient_longitude: Decimal
  recipient_password: string
  recipient_roles: UserRole[]
  recipient_created_at: Date
  recipient_updated_at: Date | null

  // Campos do courier (User, pode ser null)
  courier_id_user: string | null
  courier_cpf: string | null
  courier_name: string | null
  courier_address: string | null
  courier_latitude: Decimal | null
  courier_longitude: Decimal | null
  courier_password: string | null
  courier_roles: UserRole[] | null
  courier_created_at: Date | null
  courier_updated_at: Date | null
}

@Injectable()
export class PrismaShipmentsRepository implements ShipmentsRepository {
  constructor(
    private prisma: PrismaService,
    private shipmentAttachmentsRepository: ShipmentAttachmentsRepository,
  ) {}

  async findManyOwn(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Shipment[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: {
        OR: [{ courierId: userId }, { recipientId: userId }],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return shipments.map(PrismaShipmentMapper.toDomain)
  }

  async findManyWithCourierAndRecipient({
    page,
  }: PaginationParams): Promise<ShipmentWithCourierAndRecipient[]> {
    const shipments = await this.prisma.shipment.findMany({
      include: {
        courier: true,
        recipient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return shipments.map(PrismaShipmentWithCourierAndRecipientMapper.toDomain)
  }

  async findManyNearbyForCourier(
    courierId: string,
    maxDistanceInKm: number,
    courierLatitude: number,
    courierLongitude: number,
    { page }: PaginationParams,
  ): Promise<ShipmentWithCourierAndRecipient[]> {
    // fórmula do Haversine -- todos os campos aninhados via alias para User (recipient/courier)
    const shipments = await this.prisma.$queryRaw<
      RawNearbyShipmentWithCourierAndRecipient[]
    >`
      SELECT 
        shipments.*,

        recipient.id        AS recipient_id_user,
        recipient.cpf       AS recipient_cpf,
        recipient.name      AS recipient_name,
        recipient.address   AS recipient_address,
        recipient.latitude  AS recipient_latitude,
        recipient.longitude AS recipient_longitude,
        recipient.password  AS recipient_password,
        recipient.roles     AS recipient_roles,
        recipient.created_at AS recipient_created_at,
        recipient.updated_at AS recipient_updated_at,

        courier.id        AS courier_id_user,
        courier.cpf       AS courier_cpf,
        courier.name      AS courier_name,
        courier.address   AS courier_address,
        courier.latitude  AS courier_latitude,
        courier.longitude AS courier_longitude,
        courier.password  AS courier_password,
        courier.roles     AS courier_roles,
        courier.created_at AS courier_created_at,
        courier.updated_at AS courier_updated_at

      FROM shipments
      JOIN "users" AS recipient ON recipient.id = shipments."recipient_id"
      LEFT JOIN "users" AS courier ON courier.id = shipments."courier_id"
      WHERE (
        6371 * acos(
          cos( radians(${courierLatitude}) )
          * cos( radians( recipient.latitude ) )
          * cos( radians( recipient.longitude ) - radians(${courierLongitude}) )
          + sin( radians(${courierLatitude}) ) * sin( radians( recipient.latitude ) )
        )
      ) <= ${maxDistanceInKm} AND shipments.courier_id = ${courierId}
      ORDER BY shipments."created_at" DESC
      LIMIT 20
      OFFSET ${(page - 1) * 20}
    `

    // Transforma o raw do SQL para o formato esperado pelo Mapper
    const shipmentsWithNestedUsers: PrismaShipmentWithCourierAndRecipient[] =
      shipments.map((row) => {
        const recipient = {
          id: row.recipient_id_user,
          cpf: row.recipient_cpf,
          name: row.recipient_name,
          address: row.recipient_address,
          latitude: row.recipient_latitude,
          longitude: row.recipient_longitude,
          password: row.recipient_password,
          roles: row.recipient_roles,
          createdAt: row.recipient_created_at,
          updatedAt: row.recipient_updated_at,
        }

        let courier: PrismaUser | null = null
        if (row.courier_id_user) {
          // Checa todos campos obrigatórios do PrismaUser para garantir tipagem correta
          if (
            row.courier_cpf == null ||
            row.courier_name == null ||
            row.courier_address == null ||
            row.courier_latitude == null ||
            row.courier_longitude == null ||
            row.courier_password == null ||
            row.courier_roles == null ||
            row.courier_created_at == null
          ) {
            throw new Error(
              `Invalid nullable courier fields for shipment id: ${row.id}, courier id: ${row.courier_id_user}`,
            )
          }
          courier = {
            id: row.courier_id_user,
            cpf: row.courier_cpf,
            name: row.courier_name,
            address: row.courier_address,
            latitude: row.courier_latitude,
            longitude: row.courier_longitude,
            password: row.courier_password,
            roles: row.courier_roles as UserRole[],
            createdAt: row.courier_created_at,
            updatedAt: row.courier_updated_at,
          }
        }

        // Extração manual dos campos do shipment em camelCase
        return {
          id: row.id,
          status: row.status,
          recipientId: row.recipient_id,
          courierId: row.courier_id,
          pickupDate: row.pickup_date,
          deliveryDate: row.delivery_date,
          returnedDate: row.returned_date,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          recipient,
          courier,
        }
      })

    return shipmentsWithNestedUsers.map(
      PrismaShipmentWithCourierAndRecipientMapper.toDomain,
    )
  }

  async findAssignedForCourier(
    courierId: string,
    shipmentId: string,
  ): Promise<ShipmentDetails | null> {
    const courierShipment = await this.prisma.shipment.findFirst({
      where: {
        courierId,
        id: shipmentId,
      },
      include: {
        recipient: true,
        courier: true,
        attachments: true,
      },
    })

    if (!courierShipment) {
      return null
    }

    return PrismaShipmentDetailsMapper.toDomain(courierShipment)
  }

  async findDetailsById(id: string): Promise<ShipmentDetails | null> {
    const shipment = await this.prisma.shipment.findUnique({
      where: {
        id,
      },
      include: {
        recipient: true,
        courier: true,
        attachments: true,
      },
    })

    if (!shipment) {
      return null
    }

    return PrismaShipmentDetailsMapper.toDomain(shipment)
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

    DomainEvents.dispatchEventsForAggregate(shipment.id)
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

    DomainEvents.dispatchEventsForAggregate(shipment.id)
  }

  async delete(shipment: Shipment): Promise<void> {
    await this.prisma.shipment.delete({
      where: {
        id: shipment.id.toString(),
      },
    })

    await this.shipmentAttachmentsRepository.deleteManyByShipmentId(
      shipment.id.toString(),
    )
  }
}
