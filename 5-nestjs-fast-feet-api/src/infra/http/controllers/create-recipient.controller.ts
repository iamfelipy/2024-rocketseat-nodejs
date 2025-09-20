import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const createRecipientBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
@UseGuards(JwtAuthGuard)
export class CreateRecipientController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateRecipientBodySchema,
    @CurrentUser() loggedUser: UserPayload,
  ) {
    const { cpf, password, name, address, latitude, longitude } = body

    const loggedUserId = loggedUser.sub

    const admin = await this.prisma.user.findUnique({
      where: { id: loggedUserId },
    })

    if (!admin || !admin?.roles.includes('ADMIN')) {
      throw new ForbiddenException('Only admins can create recipients.')
    }

    const recipient = await this.prisma.user.findUnique({
      where: { cpf },
    })

    if (recipient) {
      throw new ConflictException('User with same cpf already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        cpf,
        password: hashedPassword,
        name,
        address,
        latitude,
        longitude,
        roles: ['RECIPIENT'],
      },
    })
  }
}
