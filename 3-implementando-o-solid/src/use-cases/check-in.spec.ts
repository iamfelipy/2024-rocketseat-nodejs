import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-26.99875078708264),
      longitude: new Decimal(-48.63171675406097),
    })

    // libero a funcionalidade de definir uma data especifica para usar nos testes
    vi.useFakeTimers()
  })

  afterEach(() => {
    // volta ao estado original
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    // defino a data especifica aqui
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -26.99875078708264,
      userLongitude: -48.63171675406097,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -26.99875078708264,
      userLongitude: -48.63171675406097,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -26.99875078708264,
        userLongitude: -48.63171675406097,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -26.99875078708264,
      userLongitude: -48.63171675406097,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -26.99875078708264,
      userLongitude: -48.63171675406097,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on distant gym', async () => {
    // defino a data especifica aqui

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Mega Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-26.998629212191226),
      longitude: new Decimal(-48.62539882426489),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -26.99699539520023,
        userLongitude: -48.63387414185426,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
