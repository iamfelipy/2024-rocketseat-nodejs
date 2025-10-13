import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRole } from '@/core/enums/enum-user-role'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { EditShipmentUseCase } from '@/domain/core/application/use-cases/edit-shipment'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ShipmentStatusInvalidError } from '@/domain/core/application/use-cases/erros/shipment-status-invalid-error'

const editShipmentBodySchema = z.object({
  status: z.string(),
  recipientId: z.string(),
  pickupDate: z.coerce.date().optional(),
  returnedDate: z.coerce.date().optional(),
  courierId: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editShipmentBodySchema)

type EditShipmentSchema = z.infer<typeof editShipmentBodySchema>

@Controller('/shipments/:id')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class EditShipmentController {
  constructor(private editShipment: EditShipmentUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Body(bodyValidationPipe) body: EditShipmentSchema,
    @Param('id') shipmentId: string,
  ) {
    const userLoggedId = userLogged.sub

    const { status, recipientId, pickupDate, returnedDate, courierId } = body

    const result = await this.editShipment.execute({
      adminId: userLoggedId,
      shipmentId,
      statusShipment: status,
      recipientId,
      pickupDate,
      returnedDate,
      courierId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAuthorizedError:
          throw new ForbiddenException()
        case ResourceNotFoundError:
          throw new NotFoundException()
        case ShipmentStatusInvalidError:
          throw new BadRequestException()
        default:
          throw new BadRequestException()
      }
    }
  }
}
