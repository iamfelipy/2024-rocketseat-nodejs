import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/courier-repository'
import { Courier } from '../../enterprise/entities/courier'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Location } from '../../enterprise/entities/value-objects/location'
import { Injectable } from '@nestjs/common'

interface EditCourierProfileUseCaseRequest {
  courierId: string
  name: string
  address: string
  latitude: number
  longitude: number
}
type EditCourierProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  { courier: Courier }
>

@Injectable()
export class EditCourierProfileUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
    name,
    address,
    latitude,
    longitude,
  }: EditCourierProfileUseCaseRequest): Promise<EditCourierProfileUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    courier.name = name
    courier.location = Location.create({
      address,
      latitude,
      longitude,
    })

    await this.couriersRepository.save(courier)

    return right({
      courier,
    })
  }
}
