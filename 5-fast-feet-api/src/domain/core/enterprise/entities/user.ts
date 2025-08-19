import { Entity } from '@/core/entities/entity'
import { UserRole } from '@/core/enums/enum-user-role'
import { Location } from './value-objects/location'

export interface UserProps {
  cpf: string
  password: string
  roles: UserRole[]
  name: string
  location: Location
  createdAt: Date
  updatedAt?: Date | null
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
  get cpf() {
    return this.props.cpf
  }

  set cpf(newCpf: string) {
    this.props.cpf = newCpf
    this.touch()
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

  set roles(newRoles: UserRole[]) {
    this.props.roles = newRoles
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(newName: string) {
    this.props.name = newName
    this.touch()
  }

  get location() {
    return this.props.location
  }

  set location(newLocation: Location) {
    this.props.location = newLocation
    this.touch()
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

  public static areRolesValid(roles: string[]): boolean {
    const validRoles = Object.values(UserRole)
    return roles.every(role => validRoles.includes(role as UserRole))
  }
}
