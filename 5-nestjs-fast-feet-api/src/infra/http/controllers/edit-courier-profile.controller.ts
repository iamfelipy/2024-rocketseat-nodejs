import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { EditCourierProfileUseCase } from '@/domain/core/application/use-cases/edit-courier-profile'

const editCourierProfileBodySchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editCourierProfileBodySchema)

type EditCourierProfileSchema = z.infer<typeof editCourierProfileBodySchema>

@Controller('/couriers/me')
export class EditCourierProfileController {
  constructor(private editCourierProfile: EditCourierProfileUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Body(bodyValidationPipe) body: EditCourierProfileSchema,
  ) {
    const userLoggedId = userLogged.sub

    const { name, address, latitude, longitude } = body

    const result = await this.editCourierProfile.execute({
      courierId: userLoggedId,
      name,
      address,
      latitude,
      longitude,
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
  }
}
