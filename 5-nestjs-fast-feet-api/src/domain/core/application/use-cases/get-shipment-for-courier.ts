import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/courier-repository";
import { ShipmentsRepository } from "../repositories/shipments-repository";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { Shipment } from "../../enterprise/entities/shipment";

interface GetShipmentForCourierUseCaseRequest {
  courierId: string
  shipmentId: string
}
type GetShipmentForCourierUseCaseResponse = Either<ResourceNotFoundError,{
  shipment: Shipment
}>

export class GetShipmentForCourierUseCase {
  constructor(private shipmentsRepository: ShipmentsRepository, private couriersRepository: CouriersRepository) {}
  async execute({courierId, shipmentId}:GetShipmentForCourierUseCaseRequest): Promise<GetShipmentForCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)
    if(!courier) {
      return left(new ResourceNotFoundError())
    }

    const shipment = await this.shipmentsRepository.findAssignedShipmentForCourier(courierId, shipmentId)
    if(!shipment) {
      return left(new ResourceNotFoundError())
    }

    return right({
      shipment
    })
  }
}