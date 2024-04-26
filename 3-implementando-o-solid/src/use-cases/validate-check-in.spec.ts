import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // libero a funcionalidade de definir uma data especifica para usar nos testes
    // vi.useFakeTimers()
  })

  afterEach(() => {
    // volta ao estado original
    // vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    // defino a data especifica aqui
    // vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })
  it('should not be able to validate an inexistent check-in', async () => {
    // defino a data especifica aqui
    // vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
