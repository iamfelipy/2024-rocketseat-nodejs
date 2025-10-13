import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { ShipmentStatusInvalidError } from './erros/shipment-status-invalid-error'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { CouriersRepository } from '../repositories/courier-repository'
import { Shipment } from '../../enterprise/entities/shipment'
import { Courier } from '../../enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

interface EditShipmentUseCaseRequest {
  adminId: string
  shipmentId: string
  statusShipment: string
  recipientId: string
  pickupDate?: Date | null
  returnedDate?: Date | null
  courierId?: string
  // o administrador não pode mudar a data de entrega e os anexos
}
type EditShipmentUseCaseResponse = Either<
  NotAuthorizedError | ResourceNotFoundError,
  {
    shipment: Shipment
  }
>

@Injectable()
export class EditShipmentUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private recipientsRepository: RecipientsRepository,
    private couriersRepository: CouriersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    shipmentId,
    recipientId,
    courierId,
    statusShipment,
    pickupDate,
    returnedDate,
  }: EditShipmentUseCaseRequest): Promise<EditShipmentUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if (!admin) {
      return left(new NotAuthorizedError())
    }

    const shipment = await this.shipmentsRepository.findById(shipmentId)
    if (!shipment) {
      return left(new ResourceNotFoundError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    let courierToAssign: null | Courier = null
    if (courierId) {
      courierToAssign = await this.couriersRepository.findById(courierId)
      if (!courierToAssign) {
        return left(new ResourceNotFoundError())
      }
    }

    if (
      statusShipment === ShipmentStatus.DELIVERED ||
      !Shipment.isShipmentStatus(statusShipment)
    ) {
      return left(new ShipmentStatusInvalidError())
    }

    shipment.recipientId = recipient.id
    shipment.courierId = courierToAssign?.id
    shipment.statusShipment = statusShipment
    shipment.pickupDate = pickupDate
    shipment.returnedDate = returnedDate

    await this.shipmentsRepository.save(shipment)

    return right({
      shipment,
    })
  }
}
