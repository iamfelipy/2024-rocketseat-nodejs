import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { it, beforeEach, describe, expect } from 'vitest'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/erros/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to read a notification', async () => {
    const notification = makeNotification()
    inMemoryNotificationsRepository.items.push(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readtAt).toMatchObject(
      expect.any(Date),
    )
  })
  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification()
    inMemoryNotificationsRepository.items.push(notification)

    const result = await sut.execute({
      recipientId: '',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
