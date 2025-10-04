import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ROLES_KEY } from './roles.decorator'
import { UserRole } from '@/core/enums/enum-user-role'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user?.sub) {
      throw new ForbiddenException('User not authenticated.')
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
    })

    if (!dbUser) {
      throw new ForbiddenException('User not found.')
    }

    const hasRole = requiredRoles.some((role) => dbUser.roles.includes(role))

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      )
    }

    return true
  }
}
