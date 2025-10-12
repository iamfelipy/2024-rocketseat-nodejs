import { UserRole } from '@/core/enums/enum-user-role'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { RolesGuard } from '@/infra/auth/roles.guard'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { EditCourierUseCase } from '@/domain/core/application/use-cases/edit-courier'
import { InvalidInputError } from '@/domain/core/application/use-cases/erros/invalid-input-error'

const editCourierBodySchema = z.object({
  name: z.string(),
  roles: z.array(z.nativeEnum(UserRole)),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editCourierBodySchema)

type EditCourierBodySchema = z.infer<typeof editCourierBodySchema>

@Controller('/couriers/:id')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class EditCourierController {
  constructor(private editCourier: EditCourierUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCourierBodySchema,
    @Param('id') id: string,
    @CurrentUser() userLogged: UserPayload,
  ) {
    const userLoggedId = userLogged.sub

    const { name, address, latitude, longitude, roles } = body

    const result = await this.editCourier.execute({
      courierId: id,
      adminId: userLoggedId,
      roles,
      name,
      address,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case NotAuthorizedError:
          throw new ForbiddenException()
        case ResourceNotFoundError:
          throw new NotFoundException()
        case InvalidInputError:
          throw new InvalidInputError()
        default:
          throw new BadRequestException()
      }
    }
  }
}
