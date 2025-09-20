import {
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

const createAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, cpf, address, latitude, longitude, password } = body

    const userWithSameCpf = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (userWithSameCpf) {
      throw new ConflictException('User with same cpf already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        cpf,
        address,
        latitude,
        longitude,
        password: hashedPassword,
        roles: ['ADMIN'],
      },
    })
  }
}
