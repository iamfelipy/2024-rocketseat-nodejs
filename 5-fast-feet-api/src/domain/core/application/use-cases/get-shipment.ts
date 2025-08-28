import { Either, left, right } from "@/core/either"
import { AdminsRepository } from "../repositories/admins-repository"
import { ShipmentsRepository } from "../repositories/shipments-repository"
import { Shipment } from "../../enterprise/entities/shipment"
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error"
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error"

interface GetShipmentUseCaseRequest {
  shipmentId: string
  adminId: string
}

type GetShipmentUseCaseResponse = Either<NotAuthorizedError | ResourceNotFoundError, {
  shipment: Shipment
}>

export class GetShipmentUseCase {
  constructor(private shipmentsRepository: ShipmentsRepository, private adminsRepository: AdminsRepository) {}
  async execute({
    shipmentId,
    adminId
  }: GetShipmentUseCaseRequest): Promise<GetShipmentUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if(!admin) {
      return left(new NotAuthorizedError)
    }

    const shipment = await this.shipmentsRepository.findById(shipmentId)

    if(!shipment) {
      return left(new ResourceNotFoundError)
    }

    return right({
      shipment
    })
  }
}