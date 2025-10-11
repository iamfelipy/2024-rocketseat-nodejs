import { UserRole } from '@/core/enums/enum-user-role'
import { EditRecipientProfileUseCase } from '@/domain/core/application/use-cases/edit-recipient-profile'
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
import { Public } from '@/infra/auth/public'

const editRecipientProfileBodySchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientProfileBodySchema)

type EditRecipientProfileSchema = z.infer<typeof editRecipientProfileBodySchema>

@Controller('/recipients/me')
export class EditRecipientProfileController {
  constructor(private editRecipientProfile: EditRecipientProfileUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Body(bodyValidationPipe) body: EditRecipientProfileSchema,
  ) {
    const userLoggedId = userLogged.sub

    const { name, address, latitude, longitude } = body

    const result = await this.editRecipientProfile.execute({
      recipientId: userLoggedId,
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
