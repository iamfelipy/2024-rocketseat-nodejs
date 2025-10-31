import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { ResourceNotFoundError } from "@/core/erros/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/erros/errors/not-allowed-error";

export interface ReadNotificationUseCaseRequest {
  notificationId: string,
  recipientId: string
}
export type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  notification: Notification
}>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}
  async execute({
    notificationId,
    recipientId
  }:ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId)

    if(!notification) {
      return left(new ResourceNotFoundError())
    }

    if(recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({
      notification
    })
  }
}