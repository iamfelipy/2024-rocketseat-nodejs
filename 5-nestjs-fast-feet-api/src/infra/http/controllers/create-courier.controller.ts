import { UserRole } from '@/core/enums/enum-user-role'
import { RegisterCourierUseCase } from '@/domain/core/application/use-cases/register-courier'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
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
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { CourierAlreadyExistsError } from '@/domain/core/application/use-cases/erros/courier-already-exists-error'

const createCourierBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createCourierBodySchema)

type CreateCourierBodySchema = z.infer<typeof createCourierBodySchema>

@Controller('/couriers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CreateCourierController {
  constructor(private registerCourier: RegisterCourierUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() loggedUser: UserPayload,
    @Body(bodyValidationPipe) body: CreateCourierBodySchema,
  ) {
    const { name, cpf, password, address, latitude, longitude } = body

    const loggedUserId = loggedUser.sub

    const result = await this.registerCourier.execute({
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
          throw new ForbiddenException()
        case CourierAlreadyExistsError:
          throw new ConflictException()
        default:
          throw new BadRequestException()
      }
    }
  }
}
