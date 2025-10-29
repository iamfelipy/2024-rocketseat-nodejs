import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ShipmentDetailsPresenter } from '../presenters/shipment-details-presenter'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { GetShipmentForCourierUseCase } from '@/domain/core/application/use-cases/get-shipment-for-courier'

@Controller('/couriers/me/shipments/:id')
export class GetShipmentForCourierController {
  constructor(private getShipmentForCourier: GetShipmentForCourierUseCase) {}

  @Get()
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') id: string,
  ) {
    const userLoggedId = userLogged.sub

    const result = await this.getShipmentForCourier.execute({
      courierId: userLoggedId,
      shipmentId: id,
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

    const shipment = result.value.shipment

    return {
      shipment: ShipmentDetailsPresenter.toHTTP(shipment),
    }
  }
}
