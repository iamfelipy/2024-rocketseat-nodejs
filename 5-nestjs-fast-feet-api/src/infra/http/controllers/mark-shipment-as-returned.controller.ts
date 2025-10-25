import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { UserRole } from '@/core/enums/enum-user-role'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { MarkShipmentAsReturnedUseCase } from '@/domain/core/application/use-cases/mark-shipment-as-returned'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'

@Controller('/shipments/:id/mark-as-returned')
export class MarkShipmentAsReturnedController {
  constructor(private markShipmentAsReturned: MarkShipmentAsReturnedUseCase) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') shipmentId: string,
  ) {
    const userLoggedId = userLogged.sub

    const result = await this.markShipmentAsReturned.execute({
      shipmentId,
      adminId: userLoggedId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException()
        case NotAuthorizedError:
          throw new ForbiddenException()
        default:
          throw new BadRequestException()
      }
    }
  }
}
