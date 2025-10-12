import { UserRole } from '@/core/enums/enum-user-role'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { GetRecipientUseCase } from '@/domain/core/application/use-cases/get-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { RecipientPresenter } from '../presenters/recipient-presenter'

@Controller('/recipients/:id')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class GetRecipientController {
  constructor(private getRecipient: GetRecipientUseCase) {}

  @Get()
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') id: string,
  ) {
    const userLoggedId = userLogged.sub

    const result = await this.getRecipient.execute({
      adminId: userLoggedId,
      recipientId: id,
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

    const recipient = result.value.recipient

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    }
  }
}
