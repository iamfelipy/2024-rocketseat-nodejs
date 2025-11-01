import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const userLoggedId = userLogged.sub

    const result = await this.readNotification.execute({
      notificationId,
      recipientId: userLoggedId,
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
