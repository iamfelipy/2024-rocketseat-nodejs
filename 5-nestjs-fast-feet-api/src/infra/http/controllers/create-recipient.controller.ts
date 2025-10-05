import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterRecipientUsecase } from '@/domain/core/application/use-cases/register-recipient'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { RecipientAlreadyExistsError } from '@/domain/core/application/use-cases/erros/recipient-already-exists-error'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRole } from '@/core/enums/enum-user-role'
import { RolesGuard } from '@/infra/auth/roles.guard'

const createRecipientBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CreateRecipientController {
  constructor(private registerRecipient: RegisterRecipientUsecase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateRecipientBodySchema,
    @CurrentUser() loggedUser: UserPayload,
  ) {
    const { name, cpf, password, address, latitude, longitude } = body

    const loggedUserId = loggedUser.sub

    const result = await this.registerRecipient.execute({
      name,
      cpf,
      password,
      address,
      latitude,
      longitude,
      adminId: loggedUserId,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAuthorizedError:
          throw new ForbiddenException('Only admins can create recipients.')
        case RecipientAlreadyExistsError:
          throw new ConflictException('User with same cpf already exists.')
        default:
          throw new BadRequestException()
      }
    }
  }
}
