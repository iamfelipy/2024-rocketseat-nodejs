import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserRole } from '@/core/enums/enum-user-role'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { FetchShipmentsUseCase } from '@/domain/core/application/use-cases/fetch-shipments'
import { ShipmentWithCourierAndRecipientPresenter } from '../presenters/shipment-with-courier-and-recipient-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/shipments')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class FetchShipmentsController {
  constructor(private fetchShipments: FetchShipmentsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = userLogged.sub

    const result = await this.fetchShipments.execute({
      adminId: userId,
      page,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAuthorizedError:
          throw new ForbiddenException()
        default:
          throw new BadRequestException()
      }
    }

    const shipments = result.value.shipments

    return {
      shipments: shipments.map(ShipmentWithCourierAndRecipientPresenter.toHTTP),
    }
  }
}
