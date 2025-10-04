import { UserRole } from '@/core/enums/enum-user-role'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'ROLES'
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
