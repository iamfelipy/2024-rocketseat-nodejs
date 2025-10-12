import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { RecipientPresenter } from '../presenters/recipient-presenter'
import { GetRecipientProfileUseCase } from '@/domain/core/application/use-cases/get-recipient-profile'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'

@Controller('/recipients/me')
export class GetRecipientProfileController {
  constructor(private getRecipientProfile: GetRecipientProfileUseCase) {}

  @Get()
  async handle(@CurrentUser() userLogged: UserPayload) {
    const userLoggedId = userLogged.sub

    const result = await this.getRecipientProfile.execute({
      recipientId: userLoggedId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException()
        case NotAllowedError:
          throw new ForbiddenException()
        default:
          throw new BadRequestException()
      }
    }

    const recipient = result.value.recipient

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    }
  }
}
