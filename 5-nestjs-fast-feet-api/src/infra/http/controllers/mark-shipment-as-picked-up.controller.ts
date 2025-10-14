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
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { MarkShipmentAsPickedUpUseCase } from '@/domain/core/application/use-cases/mark-shipment-as-picked-up'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const markShipmentAsPickedUpBodySchema = z.object({
  courierId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  markShipmentAsPickedUpBodySchema,
)

type MarkShipmentAsPickedUpBodySchema = z.infer<
  typeof markShipmentAsPickedUpBodySchema
>

@Controller('/shipments/:id/mark-as-picked-up')
export class MarkShipmentAsPickedUpController {
  constructor(private markShipmentAsPickedUp: MarkShipmentAsPickedUpUseCase) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') shipmentId: string,
    @Body(bodyValidationPipe) body: MarkShipmentAsPickedUpBodySchema,
  ) {
    const { courierId } = body

    const userLoggedId = userLogged.sub

    const result = await this.markShipmentAsPickedUp.execute({
      shipmentId,
      courierId,
      adminId: userLoggedId,
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
  }
}
