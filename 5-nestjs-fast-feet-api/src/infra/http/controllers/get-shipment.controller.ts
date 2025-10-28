import { UserRole } from '@/core/enums/enum-user-role'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { GetShipmentUseCase } from '@/domain/core/application/use-cases/get-shipment'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ShipmentDetailsPresenter } from '../presenters/shipment-details-presenter'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'

@Controller('/shipments/:id')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class GetShipmentController {
  constructor(private getShipment: GetShipmentUseCase) {}

  @Get()
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') id: string,
  ) {
    const userLoggedId = userLogged.sub

    const result = await this.getShipment.execute({
      adminId: userLoggedId,
      shipmentId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAuthorizedError:
          throw new ForbiddenException()
        case ResourceNotFoundError:
          throw new NotFoundException()
        default:
          throw new BadRequestException()
      }
    }

    const shipment = result.value.shipment

    return {
      shipment: ShipmentDetailsPresenter.toHTTP(shipment),
    }
  }
}
