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
import { AuthenticateRecipientUseCase } from '@/domain/core/application/use-cases/authenticate-recipient'
import { CreateCourierController } from './controllers/create-courier.controller'
import { RegisterCourierUseCase } from '@/domain/core/application/use-cases/register-courier'
import { GetRecipientByAdminController } from './controllers/get-recipient-by-admin.controller'
import { GetRecipientByAdminUseCase } from '@/domain/core/application/use-cases/get-recipient-by-admin'
import { EditRecipientProfileController } from './controllers/edit-recipient-profile.controller'
import { EditRecipientProfileUseCase } from '@/domain/core/application/use-cases/edit-recipient-profile'
import { EditRecipientUseCase } from '@/domain/core/application/use-cases/edit-recipient'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/core/application/use-cases/delete-recipient'
import { GetCourierController } from './controllers/get-courier.controller'
import { GetCourierUseCase } from '@/domain/core/application/use-cases/get-courier'
import { GetCourierProfileUseCase } from '@/domain/core/application/use-cases/get-courier-profile'
import { GetCourierProfileController } from './controllers/get-courier-profile.controller'
import { DeleteCourierController } from './controllers/delete-courier.controller'
import { DeleteCourierUseCase } from '@/domain/core/application/use-cases/delete-courier'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateRecipientController,
    FetchRecipientsController,
    CreateAccountController,
    CreateAdminController,
    CreateRecipientController,
    CreateCourierController,
    GetCourierProfileController,
    GetCourierController,
    DeleteCourierController,
    GetRecipientByAdminController,
    EditRecipientProfileController,
    EditRecipientController,
    DeleteRecipientController,
  ],
  providers: [
    RegisterAdminUseCase,
    RegisterRecipientUsecase,
    AuthenticateRecipientUseCase,
    FetchRecipientsUseCase,
    RegisterCourierUseCase,
    GetCourierUseCase,
    GetCourierProfileUseCase,
    DeleteCourierUseCase,
    GetRecipientByAdminUseCase,
    EditRecipientProfileUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
  ],
})
export class HttpModule {}
