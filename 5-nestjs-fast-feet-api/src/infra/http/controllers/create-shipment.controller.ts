import { UserRole } from '@/core/enums/enum-user-role'
import { CreateShipmentUseCase } from '@/domain/core/application/use-cases/create-shipment'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'

const createShipmentBodySchema = z.object({
  recipientId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createShipmentBodySchema)

type CreateShipmentBodySchema = z.infer<typeof createShipmentBodySchema>

@Controller('/shipments')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class CreateShipmentController {
  constructor(private createShipment: CreateShipmentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateShipmentBodySchema,
    @CurrentUser() loggedUser: UserPayload,
  ) {
    const { recipientId } = body

    const loggedUserId = loggedUser.sub

    const result = await this.createShipment.execute({
      recipientId,
      adminId: loggedUserId,
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
