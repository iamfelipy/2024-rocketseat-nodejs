import {
  Controller,
  Delete,
  Param,
  HttpCode,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { DeleteShipmentUseCase } from '@/domain/core/application/use-cases/delete-shipment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRole } from '@/core/enums/enum-user-role'

@Controller('/shipments/:id')
export class DeleteShipmentController {
  constructor(private deleteShipment: DeleteShipmentUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') id: string,
  ) {
    const userLoggedId = userLogged.sub

    const result = await this.deleteShipment.execute({
      shipmentId: id,
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
