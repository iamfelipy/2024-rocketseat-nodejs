import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserRole } from '@/core/enums/enum-user-role'
import { FetchRecipientsUseCase } from '@/domain/core/application/use-cases/fetch-recipients'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { RecipientPresenter } from '../presenters/recipient-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/recipients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class FetchRecipientsController {
  constructor(private fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = userLogged.sub

    const result = await this.fetchRecipients.execute({
      adminId: userId,
      page,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAuthorizedError:
          throw new ForbiddenException('Only admins can create recipients.')
        default:
          throw new BadRequestException()
      }
    }

    const recipients = result.value.recipients

    return {
      recipients: recipients.map(RecipientPresenter.toHTTP),
    }
  }
}
