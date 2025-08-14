import { Optional } from '@/core/types/optional'
import { User, UserProps } from './user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/enum-user-role'

export interface CourierProps extends UserProps {}

export class Courier extends User<CourierProps> {
  isCourier() {
    return this.props.roles.includes(UserRole.COURIER)
  }

  static create(
    props: Optional<CourierProps, 'createdAt' | 'roles'>,
    id?: UniqueEntityID,
  ) {
    const courier = new Courier(
      {
        ...props,
        roles: props.roles ?? [UserRole.COURIER],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return courier
  }
}
