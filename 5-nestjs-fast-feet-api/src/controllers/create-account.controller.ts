import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
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
      },
    })
  }
}
