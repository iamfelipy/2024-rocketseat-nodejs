import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateAdminController } from './controllers/create-admin.controller'
import { RegisterAdminUseCase } from '@/domain/core/application/use-cases/register-admin'
import { CryptographyModule } from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateRecipientController,
    FetchRecipientsController,
    CreateAdminController,
  ],
  providers: [RegisterAdminUseCase],
})
export class HttpModule {}
