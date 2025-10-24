import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { ShipmentsRepository } from '../repositories/shipments-repository'
import { CouriersRepository } from '../repositories/courier-repository'
import { ShipmentAttachment } from '../../enterprise/entities/shipment-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ShipmentAttachmentList } from '../../enterprise/entities/shipment-attachment-list'
import { ShipmentStatus } from '@/core/enums/shipment-status'
import { ShipmentNotAssignedToCourierError } from './erros/shipment-not-assigned-to-courier-error'
import { PhotoRequiredForDeliveryError } from './erros/photo-required-for-delivery-error'
import { Shipment } from '../../enterprise/entities/shipment'
import { Injectable } from '@nestjs/common'
import { ShipmentAttachmentsRepository } from '../repositories/shipment-attachments-repository'

interface MarkShipmentAsDeliveredUseCaseRequest {
  courierId: string
  shipmentId: string
  attachmentsIds: string[]
}

type MarkShipmentAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    shipment: Shipment
  }
>

@Injectable()
export class MarkShipmentAsDeliveredUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository,
    private couriersRepository: CouriersRepository,
    private shipmentAttachmentsRepository: ShipmentAttachmentsRepository,
  ) {}

  async execute({
    courierId,
    shipmentId,
    attachmentsIds,
  }: MarkShipmentAsDeliveredUseCaseRequest): Promise<MarkShipmentAsDeliveredUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)
    if (!courier) {
      return left(new ResourceNotFoundError())
    }
    const shipment = await this.shipmentsRepository.findById(shipmentId)
    if (!shipment) {
      return left(new ResourceNotFoundError())
    }

    if (!shipment.courierId || shipment.courierId.toString() !== courierId) {
      return left(new ShipmentNotAssignedToCourierError())
    }

    const currentShipmentAttachments =
      await this.shipmentAttachmentsRepository.findManyByShipmentId(shipmentId)

    const shipmentAttachmentList = new ShipmentAttachmentList(
      currentShipmentAttachments,
    )

    const shipmentAttachments = attachmentsIds.map((attachmentId) => {
      return ShipmentAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        shipmentId: shipment.id,
      })
    })

    shipmentAttachmentList.update(shipmentAttachments)

    if (
      !shipmentAttachmentList ||
      shipmentAttachmentList?.currentItems?.length === 0
    ) {
      return left(new PhotoRequiredForDeliveryError())
    }

    shipment.attachments = shipmentAttachmentList
    shipment.statusShipment = ShipmentStatus.DELIVERED
    shipment.deliveryDate = new Date()

    await this.shipmentsRepository.save(shipment)

    return right({
      shipment,
    })
  }
}
