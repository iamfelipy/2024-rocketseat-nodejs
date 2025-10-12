import { UserRole } from '@/core/enums/enum-user-role'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
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
import { GetCourierUseCase } from '@/domain/core/application/use-cases/get-courier'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { CourierPresenter } from '../presenters/courier-presenter'

@Controller('/couriers/:id')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class GetCourierController {
  constructor(private getCourier: GetCourierUseCase) {}

  @Get()
  async handle(
    @CurrentUser() userLogged: UserPayload,
    @Param('id') id: string,
  ) {
    const userLoggedId = userLogged.sub

    const result = await this.getCourier.execute({
      adminId: userLoggedId,
      courierId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAuthorizedError:
          throw new ForbiddenException()
        case ResourceNotFoundError:
          throw new NotAuthorizedError()
        default:
          throw new BadRequestException()
      }
    }

    const courier = result.value.courier

    return {
      courier: CourierPresenter.toHTTP(courier),
    }
  }
}
