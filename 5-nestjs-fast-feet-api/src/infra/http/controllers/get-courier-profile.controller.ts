import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { CourierPresenter } from '../presenters/courier-presenter'
import { GetCourierProfileUseCase } from '@/domain/core/application/use-cases/get-courier-profile'

@Controller('/couriers/me')
export class GetCourierProfileController {
  constructor(private getCourierProfile: GetCourierProfileUseCase) {}

  @Get()
  async handle(@CurrentUser() userLogged: UserPayload) {
    const userLoggedId = userLogged.sub

    const result = await this.getCourierProfile.execute({
      courierId: userLoggedId,
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

    const courier = result.value.courier

    return {
      courier: CourierPresenter.toHTTP(courier),
    }
  }
}
