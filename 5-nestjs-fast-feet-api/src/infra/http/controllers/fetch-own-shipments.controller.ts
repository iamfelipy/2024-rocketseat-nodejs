import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { ShipmentPresenter } from '../presenters/shipment-presenter'
import { FetchOwnShipmentsUseCase } from '@/domain/core/application/use-cases/fetch-own-shipments'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/shipments/me')
export class FetchOwnShipmentsController {
  constructor(private fetchOwnShipments: FetchOwnShipmentsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = userLogged.sub

    const result = await this.fetchOwnShipments.execute({
      userId,
      page,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException()
        default:
          throw new BadRequestException()
      }
    }

    const shipments = result.value.shipments

    return {
      shipments: shipments.map(ShipmentPresenter.toHTTP),
    }
  }
}
