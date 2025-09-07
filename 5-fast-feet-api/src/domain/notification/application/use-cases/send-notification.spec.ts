import { beforeEach, describe, expect, it } from 'vitest'
import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })
  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'new notification',
      content: 'new content',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result?.value?.notification,
    )
  })
})
