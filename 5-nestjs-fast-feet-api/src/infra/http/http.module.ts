import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateRecipientController,
    FetchRecipientsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
