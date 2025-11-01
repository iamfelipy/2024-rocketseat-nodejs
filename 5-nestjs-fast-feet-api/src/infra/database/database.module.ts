import { PrismaService } from './prisma/prisma.service'
import { Module } from '@nestjs/common'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { PrismaShipmentsRepository } from './prisma/repositories/prisma-shipments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaShipmentAttachmentsRepository } from './prisma/repositories/prisma-shipment-attachments-repository'
import { ShipmentsRepository } from '@/domain/core/application/repositories/shipments-repository'
import { AdminsRepository } from '@/domain/core/application/repositories/admins-repository'
import { RecipientsRepository } from '@/domain/core/application/repositories/recipients-repository'
import { CouriersRepository } from '@/domain/core/application/repositories/courier-repository'
import { ShipmentAttachmentsRepository } from '@/domain/core/application/repositories/shipment-attachments-repository'
import { AttachmentsRepository } from '@/domain/core/application/repositories/attachments-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: ShipmentsRepository,
      useClass: PrismaShipmentsRepository,
    },
    {
      provide: ShipmentAttachmentsRepository,
      useClass: PrismaShipmentAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    CouriersRepository,
    RecipientsRepository,
    ShipmentsRepository,
    ShipmentAttachmentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
