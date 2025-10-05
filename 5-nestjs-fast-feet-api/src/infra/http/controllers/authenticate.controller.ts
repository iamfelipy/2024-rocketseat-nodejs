import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateRecipientUseCase } from '@/domain/core/application/use-cases/authenticate-recipient'
import { WrongCredentialsError } from '@/domain/core/application/use-cases/erros/wrong-credentials-error'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateRecipient: AuthenticateRecipientUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateRecipient.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException('User credentials do not match.')
        default:
          throw new BadRequestException()
      }
    }

    const accessToken = result.value.accessToken

    return {
      access_token: accessToken,
    }
  }
}
