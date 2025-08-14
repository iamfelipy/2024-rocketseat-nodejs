import { Entity } from '@/core/entities/entity'
import { UserRole } from '@/core/enums/enum-user-role'

export interface UserProps {
  cpf: string
  password: string
  roles: UserRole[]
  name: string
  createdAt: Date
  updatedAt?: Date | null
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set password(newPassword: string) {
    this.props.password = newPassword
    this.touch()
  }

  get roles() {
    return this.props.roles
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  protected touch() {
    this.props.updatedAt = new Date()
  }
}
