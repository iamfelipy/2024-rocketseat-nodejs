import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterAdminUseCase } from '@/domain/core/application/use-cases/register-admin'
import { AdminAlreadyExistsError } from '@/domain/core/application/use-cases/erros/admin-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAdminBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createAdminBodySchema)

type CreateAdminBodySchema = z.infer<typeof createAdminBodySchema>

@Controller('/admins')
@Public()
export class CreateAdminController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateAdminBodySchema) {
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
      if (result.value instanceof AdminAlreadyExistsError) {
        throw new ConflictException('Admin with same cpf already exists.')
      }

      throw new BadRequestException()
    }
  }
}
