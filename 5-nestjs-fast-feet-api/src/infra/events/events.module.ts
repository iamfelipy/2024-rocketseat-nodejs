import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnShipmentStatusChanged } from '@/domain/notification/application/subscribers/on-shipment-status-changed'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [OnShipmentStatusChanged, SendNotificationUseCase],
})
export class EventsModule {}
