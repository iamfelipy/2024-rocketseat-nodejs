import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { AdminsRepository } from "../repositories/admins-repository";
import { ShipmentsRepository } from "../repositories/shipments-repository";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";
import { ShipmentStatus } from "@/core/enums/shipment-status";
import { ShipmentStatusInvalidError } from "./erros/shipment-status-invalid-error";
import { ShipmentAttachmentsRepository } from "../repositories/shipment-attachments-repository";
import { ShipmentAttachmentList } from "../../enterprise/entities/shipment-attachment-list";
import { ShipmentAttachment } from "../../enterprise/entities/shipment-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { CouriersRepository } from "../repositories/courier-repository";
import { Shipment } from "../../enterprise/entities/shipment";

interface EditShipmentUseCaseRequest {
  adminId: string
  shipmentId: string
  statusShipment: string
  recipientId: string
  pickupDate?: Date | null
  deliveryDate?: Date | null
  returnedDate?: Date | null
  attachmentsIds: string[]
  courierId: string
}
type EditShipmentUseCaseResponse = Either<NotAuthorizedError | ResourceNotFoundError, {
  shipment: Shipment
}>

export class EditShipmentUseCase {
  constructor(
    private shipmentsRepository: ShipmentsRepository, 
    private shipmentAttachmentsRepository: ShipmentAttachmentsRepository,
    private recipientsRepository: RecipientsRepository,
    private couriersRepository: CouriersRepository,
    private adminsRepository: AdminsRepository
  ) {}
  async execute({
    adminId, 
    shipmentId,
    statusShipment,
    recipientId,
    pickupDate,
    deliveryDate,
    returnedDate,
    attachmentsIds,
    courierId
  }:EditShipmentUseCaseRequest): Promise<EditShipmentUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if(!admin) {
      return left(new NotAuthorizedError())
    }

    const shipment = await this.shipmentsRepository.findById(shipmentId)
    if(!shipment) {
      return left(new ResourceNotFoundError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)
    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const courierToAssign = await this.couriersRepository.findById(courierId)
    if (!courierToAssign && courierId) {
      return left(new ResourceNotFoundError())
    }

    const validStatuses = Object.values(ShipmentStatus)
    if (!validStatuses.includes(statusShipment as ShipmentStatus)) {
      return left(new ShipmentStatusInvalidError())
    }

    const currentShipmentAttachments = await this.shipmentAttachmentsRepository.findManyByShipmentId(shipmentId)
    const shipmentAttachmentList = new ShipmentAttachmentList(currentShipmentAttachments)

    const shipmentAttachments = attachmentsIds.map(attachmentId => {
      return ShipmentAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        shipmentId: shipment.id
      })
    })
    
    shipmentAttachmentList.update(shipmentAttachments)

    shipment.statusShipment = statusShipment as ShipmentStatus
    shipment.recipientId = recipient.id
    shipment.pickupDate = pickupDate
    shipment.deliveryDate = deliveryDate
    shipment.returnedDate = returnedDate
    shipment.courierId = courierToAssign?.id
    shipment.attachments = shipmentAttachmentList

    await this.shipmentsRepository.save(shipment)

    return right({
      shipment
    })
    
  }
}