import { UserRole } from '@/core/enums/enum-user-role'
import { User, UserProps } from './user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RecipientProps extends UserProps {}

export class Recipient extends User<RecipientProps> {

  isRecipient() {
    return this.props.roles.includes(UserRole.RECIPIENT)
  }

  static create(
    props: Optional<RecipientProps, 'createdAt' | 'roles'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        roles: props.roles ?? [UserRole.RECIPIENT],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return recipient
  }
}
