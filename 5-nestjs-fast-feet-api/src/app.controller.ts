import { Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Controller('/api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get('/hello')
  async index() {
    return await this.prisma.user.findFirst()
  }

  @Post('/hello')
  async store() {
    return await this.prisma.user.create({
      data: {
        name: 'sergio camelo',
        cpf: '06450376988',
        address: 'emilio dias fontes',
        latitude: 12333443,
        longitude: 221313123,
      },
    })
  }
}
