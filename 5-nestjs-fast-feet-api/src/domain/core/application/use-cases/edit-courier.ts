import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/courier-repository'
import { Courier } from '../../enterprise/entities/courier'
import { UserRole } from '@/core/enums/enum-user-role'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'
import { Location } from '../../enterprise/entities/value-objects/location'
import { InvalidInputError } from './erros/invalid-input-error'
import { Injectable } from '@nestjs/common'

interface EditCourierUseCaseRequest {
  courierId: string
  roles: string[]
  name: string
  address: string
  latitude: number
  longitude: number
  adminId: string
}
type EditCourierUseCaseResponse = Either<
  NotAuthorizedError | NotAllowedError,
  { courier: Courier }
>

@Injectable()
export class EditCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    courierId,
    roles,
    name,
    address,
    latitude,
    longitude,
    adminId,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin || !admin.isAdmin()) {
      return left(new NotAuthorizedError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    if (!Courier.areRolesValid(roles)) {
      return left(new InvalidInputError())
    }

    courier.roles = roles as UserRole[]
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
