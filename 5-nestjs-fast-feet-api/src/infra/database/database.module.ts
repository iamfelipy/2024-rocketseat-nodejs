import { PrismaService } from './prisma/prisma.service'
import { Module } from '@nestjs/common'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { PrismaShipmentsRepository } from './prisma/repositories/prisma-shipments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaShipmentAttachmentsRepository } from './prisma/repositories/prisma-shipment-attachments-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAdminsRepository,
    PrismaCouriersRepository,
    PrismaRecipientsRepository,
    PrismaShipmentsRepository,
    PrismaAttachmentsRepository,
    PrismaShipmentAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAdminsRepository,
    PrismaCouriersRepository,
    PrismaRecipientsRepository,
    PrismaShipmentsRepository,
    PrismaAttachmentsRepository,
    PrismaShipmentAttachmentsRepository,
  ],
})
export class DatabaseModule {}
