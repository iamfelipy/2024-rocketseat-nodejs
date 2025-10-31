import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ChangeCourierPasswordUseCase } from '@/domain/core/application/use-cases/change-courier-password'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRole } from '@/core/enums/enum-user-role'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'

const changePasswordBodySchema = z.object({
  newPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(changePasswordBodySchema)

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/users/:userId/change-password')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class ChangePasswordController {
  constructor(private changePasswordCourier: ChangeCourierPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('userId') userId: string,
    @Body(bodyValidationPipe) body: ChangePasswordBodySchema,
  ) {
    const { newPassword } = body
    const userLoggedId = userLogged.sub

    const result = await this.changePasswordCourier.execute({
      courierId: userId,
      adminId: userLoggedId,
      newPassword,
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
