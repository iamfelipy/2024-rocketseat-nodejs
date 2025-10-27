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
import { GetRecipientController } from './controllers/get-recipient.controller'
import { GetRecipientUseCase } from '@/domain/core/application/use-cases/get-recipient'
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
import { EditCourierProfileController } from './controllers/edit-courier-profile.controller'
import { EditCourierProfileUseCase } from '@/domain/core/application/use-cases/edit-courier-profile'
import { EditCourierController } from './controllers/edit-courier.controller'
import { EditCourierUseCase } from '@/domain/core/application/use-cases/edit-courier'
import { FetchCouriersController } from './controllers/fetch-couriers.controller'
import { FetchCouriersUseCase } from '@/domain/core/application/use-cases/fetch-couriers'
import { GetRecipientProfileController } from './controllers/get-recipient-profile.controller'
import { GetRecipientProfileUseCase } from '@/domain/core/application/use-cases/get-recipient-profile'
import { CreateShipmentController } from './controllers/create-shipment.controller'
import { CreateShipmentUseCase } from '@/domain/core/application/use-cases/create-shipment'
import { EditShipmentController } from './controllers/edit-shipment.controller'
import { EditShipmentUseCase } from '@/domain/core/application/use-cases/edit-shipment'
import { DeleteShipmentUseCase } from '@/domain/core/application/use-cases/delete-shipment'
import { DeleteShipmentController } from './controllers/delete-shipment.controller'
import { MarkAsAwaitingPickupController } from './controllers/mark-as-awaiting-pickup.controller'
import { MarkAsAwaitingPickupUseCase } from '@/domain/core/application/use-cases/mark-as-awaiting-pickup'
import { MarkShipmentAsPickedUpUseCase } from '@/domain/core/application/use-cases/mark-shipment-as-picked-up'
import { MarkShipmentAsPickedUpController } from './controllers/mark-shipment-as-picked-up.controller'
import { StorageModule } from '../storage/storage.module'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/core/application/use-cases/upload-and-create-attachment'
import { MarkShipmentAsDeliveredUseCase } from '@/domain/core/application/use-cases/mark-shipment-as-delivered'
import { MarkShipmentAsDeliveredController } from './controllers/mark-shipment-as-delivered.controller'
import { MarkShipmentAsReturnedController } from './controllers/mark-shipment-as-returned.controller'
import { MarkShipmentAsReturnedUseCase } from '@/domain/core/application/use-cases/mark-shipment-as-returned'
import { FetchShipmentsController } from './controllers/fetch-shipments.controller'
import { FetchShipmentsUseCase } from '@/domain/core/application/use-cases/fetch-shipments'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateAdminController,

    CreateCourierController,
    FetchCouriersController,
    GetCourierProfileController,
    GetCourierController,
    EditCourierProfileController,
    EditCourierController,
    DeleteCourierController,

    CreateRecipientController,
    FetchRecipientsController,
    GetRecipientProfileController,
    GetRecipientController,
    EditRecipientProfileController,
    EditRecipientController,
    DeleteRecipientController,

    CreateShipmentController,
    EditShipmentController,
    DeleteShipmentController,
    FetchShipmentsController,
    MarkAsAwaitingPickupController,
    MarkShipmentAsPickedUpController,
    MarkShipmentAsDeliveredController,
    MarkShipmentAsReturnedController,

    UploadAttachmentController,
  ],
  providers: [
    RegisterAdminUseCase,
    AuthenticateRecipientUseCase,

    RegisterCourierUseCase,
    FetchCouriersUseCase,
    GetCourierUseCase,
    GetCourierProfileUseCase,
    EditCourierProfileUseCase,
    EditCourierUseCase,
    DeleteCourierUseCase,

    RegisterRecipientUsecase,
    FetchRecipientsUseCase,
    GetRecipientProfileUseCase,
    GetRecipientUseCase,
    EditRecipientProfileUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,

    CreateShipmentUseCase,
    EditShipmentUseCase,
    DeleteShipmentUseCase,
    FetchShipmentsUseCase,
    MarkAsAwaitingPickupUseCase,
    MarkShipmentAsPickedUpUseCase,
    MarkShipmentAsDeliveredUseCase,
    MarkShipmentAsReturnedUseCase,

    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
