import { GymsRepository } from '@/repositories/gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: GymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -27.21274453931159,
      longitude: -49.637259513146326,
    })

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -27.062024625829558,
      longitude: -49.52516748793897,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.213309189492428,
      userLongitude: -49.636438867688796,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
