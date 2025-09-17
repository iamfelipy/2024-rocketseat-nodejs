import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/recipients')
@UseGuards(JwtAuthGuard)
export class FetchRecipientsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @CurrentUser() loggedUser: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const loggedUserId = loggedUser.sub

    const admin = await this.prisma.user.findUnique({
      where: { id: loggedUserId },
    })

    if (!admin || !admin?.roles.includes('ADMIN')) {
      throw new ForbiddenException('Only admins can create recipients.')
    }

    const perPage = 1

    const recipients = await this.prisma.user.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      recipients,
    }
  }
}
