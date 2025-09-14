import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'

@Controller('/recipients')
@UseGuards(JwtAuthGuard)
export class CreateRecipientController {
  constructor() {}

  @Post()
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub)
    return 'ok'
  }
}
