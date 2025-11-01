import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from '@/core/erros/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { NotAuthorizedError } from '@/core/erros/errors/not-authorized-error'

export interface ReadNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}
export type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}
  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAuthorizedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification,
    })
  }
}
