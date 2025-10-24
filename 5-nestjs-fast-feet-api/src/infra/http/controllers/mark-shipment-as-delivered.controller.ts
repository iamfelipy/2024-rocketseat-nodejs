import {
  BadRequestException,
  Body,
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
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { MarkShipmentAsDeliveredUseCase } from '@/domain/core/application/use-cases/mark-shipment-as-delivered'
import { ShipmentNotAssignedToCourierError } from '@/domain/core/application/use-cases/erros/shipment-not-assigned-to-courier-error'
import { PhotoRequiredForDeliveryError } from '@/domain/core/application/use-cases/erros/photo-required-for-delivery-error'

const markShipmentAsDeliveredBodySchema = z.object({
  attachmentsIds: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(
  markShipmentAsDeliveredBodySchema,
)

type MarkShipmentAsDeliveredBodySchema = z.infer<
  typeof markShipmentAsDeliveredBodySchema
>

@Controller('/shipments/:id/mark-as-delivered')
export class MarkShipmentAsDeliveredController {
  constructor(
    private markShipmentAsDelivered: MarkShipmentAsDeliveredUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles(UserRole.COURIER)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') shipmentId: string,
    @Body(bodyValidationPipe) body: MarkShipmentAsDeliveredBodySchema,
  ) {
    const { attachmentsIds } = body

    const userLoggedId = userLogged.sub

    const result = await this.markShipmentAsDelivered.execute({
      shipmentId,
      courierId: userLoggedId,
      attachmentsIds,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException()
        case ShipmentNotAssignedToCourierError:
          throw new ForbiddenException()
        case PhotoRequiredForDeliveryError:
          throw new BadRequestException()
        default:
          throw new BadRequestException()
      }
    }
  }
}
