import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateAdminController } from './controllers/create-admin.controller'
import { RegisterAdminUseCase } from '@/domain/core/application/use-cases/register-admin'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterRecipientUsecase } from '@/domain/core/application/use-cases/register-recipient'
import { FetchRecipientsUseCase } from '@/domain/core/application/use-cases/fetch-recipients'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateRecipientController,
    FetchRecipientsController,
    CreateAccountController,
    CreateAdminController,
    CreateRecipientController,
  ],
  providers: [
    RegisterAdminUseCase,
    RegisterRecipientUsecase,
    FetchRecipientsUseCase,
  ],
})
export class HttpModule {}
