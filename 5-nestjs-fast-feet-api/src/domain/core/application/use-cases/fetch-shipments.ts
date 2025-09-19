import { Either, left, right } from "@/core/either";
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error";
import { ShipmentsRepository } from "../repositories/shipments-repository";
import { AdminsRepository } from "../repositories/admins-repository";
import { Shipment } from "../../enterprise/entities/shipment";

interface FetchShipmentsUseCaseRequest {
  adminId: string
  page: number
}
type FetchShipmentsUseCaseResponse = Either<NotAuthorizedError, {
  shipments: Shipment[]
}>

export class FetchShipmentsUseCase {
  constructor(private shipmentsRepository: ShipmentsRepository, private adminsRepository: AdminsRepository) {}
  async execute({
    adminId,
    page
  }:FetchShipmentsUseCaseRequest): Promise<FetchShipmentsUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)
    if(!admin) {
      return left(new NotAuthorizedError)
    }

    const shipments = await this.shipmentsRepository.findMany({page})

    return right({
      shipments
    })
  }
}