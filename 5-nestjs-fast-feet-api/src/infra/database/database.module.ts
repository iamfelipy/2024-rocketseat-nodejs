import { PrismaService } from './prisma/prisma.service'
import { Module } from '@nestjs/common'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { PrismaShipmentsRepository } from './prisma/repositories/prisma-shipments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaShipmentAttachmentsRepository } from './prisma/repositories/prisma-shipment-attachments-repository'
import { AdminsRepository } from '@/domain/core/application/repositories/admins-repository'
import { RecipientsRepository } from '@/domain/core/application/repositories/recipients-repository'
import { CouriersRepository } from '@/domain/core/application/repositories/courier-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    PrismaCouriersRepository,
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    PrismaShipmentsRepository,
    PrismaAttachmentsRepository,
    PrismaShipmentAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    CouriersRepository,
    RecipientsRepository,
    PrismaShipmentsRepository,
    PrismaAttachmentsRepository,
    PrismaShipmentAttachmentsRepository,
  ],
})
export class DatabaseModule {}
