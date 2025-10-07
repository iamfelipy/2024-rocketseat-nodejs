import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { RegisterAdminUseCase } from '@/domain/core/application/use-cases/register-admin'
import { AdminAlreadyExistsError } from '@/domain/core/application/use-cases/erros/admin-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

// TODO: criar caso de uso generico para criação de usuario generico e não usar o admin
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, cpf, address, latitude, longitude, password } = body

    const result = await this.registerAdmin.execute({
      name,
      cpf,
      password,
      address,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case AdminAlreadyExistsError:
          throw new ConflictException('User with same cpf already exists.')
        default:
          throw new BadRequestException()
      }
    }
  }
}
