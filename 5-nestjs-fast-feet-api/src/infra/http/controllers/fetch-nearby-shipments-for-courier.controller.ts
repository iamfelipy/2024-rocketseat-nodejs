import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchNearbyShipmentsForCourierUseCase } from '@/domain/core/application/use-cases/fetch-nearby-shipments-for-courier'
import { ShipmentWithCourierAndRecipientPresenter } from '../presenters/shipment-with-courier-and-recipient-presenter'

const bodySchema = z.object({
  maxDistanceInKm: z
    .number()
    .min(0.1, { message: 'maxDistanceInKm must be greater than 0' }),
  courierLatitude: z.number().min(-90).max(90),
  courierLongitude: z.number().min(-180).max(180),
})

const bodyvalidationPipe = new ZodValidationPipe(bodySchema)
type BodySchema = z.infer<typeof bodySchema>

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/couriers/me/shipments/nearby')
export class FetchNearbyShipmentsForCourierController {
  constructor(
    private fetchNearbyShipmentsForCourier: FetchNearbyShipmentsForCourierUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() userLogged: UserPayload,
    @Body(bodyvalidationPipe) body: BodySchema,
  ) {
    const userId = userLogged.sub
    const { maxDistanceInKm, courierLatitude, courierLongitude } = body

    const result = await this.fetchNearbyShipmentsForCourier.execute({
      courierId: userId,
      maxDistanceInKm,
      courierLatitude,
      courierLongitude,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const shipments = result.value.shipments

    return {
      shipments: shipments.map(ShipmentWithCourierAndRecipientPresenter.toHTTP),
    }
  }
}
