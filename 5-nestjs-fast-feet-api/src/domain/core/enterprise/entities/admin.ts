import { Optional } from '@/core/types/optional'
import { User, UserProps } from './user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/core/enums/enum-user-role'

export type AdminProps = UserProps

export class Admin extends User<AdminProps> {
  isAdmin() {
    return this.props.roles.includes(UserRole.ADMIN)
  }

  static create(
    props: Optional<AdminProps, 'createdAt' | 'roles'>,
    id?: UniqueEntityID,
  ) {
    const admin = new Admin(
      {
        ...props,
        roles: props.roles ?? [UserRole.ADMIN],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return admin
  }
}
