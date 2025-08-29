import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins";
import { InMemoryRecipientsRepository } from "@/test/repositories/in-memory-recipients";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchRecipientsUseCase } from "./fetch-recipients";
import { makeRecipient } from "@/test/factories/make-recipient";
import { makeAdmin } from "@/test/factories/make-admin";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let sut: FetchRecipientsUseCase

describe('Fetch Recipients', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    sut = new FetchRecipientsUseCase(inMemoryRecipientsRepository, inMemoryAdminsRepository)
  })
  it('should be able to fetch recipients', async () => {
    
    inMemoryRecipientsRepository.items.push(
      makeRecipient({}, new UniqueEntityID('recipient-1')),
      makeRecipient({}, new UniqueEntityID('recipient-2'))
    )
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 1
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(2)
    expect(result.value).toMatchObject({
      recipients: expect.arrayContaining([
        expect.objectContaining({
          id: new UniqueEntityID('recipient-1')
        }),
        expect.objectContaining({
          id: new UniqueEntityID('recipient-2')
        }),
      ])
    })
  })
  it('should be able to fetch paginated recipients', async () => {
    const admin = makeAdmin()
    inMemoryAdminsRepository.items.push(admin)

    for(let i = 1; i <= 22; i++) {
      inMemoryRecipientsRepository.items.push(makeRecipient({}, new UniqueEntityID('recipient-'+i)))
    }

    const result = await sut.execute({
      adminId: admin.id.toString(),
      page: 2
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      recipients: expect.arrayContaining([
        expect.objectContaining({
          id: new UniqueEntityID('recipient-21')
        }),
        expect.objectContaining({
          id: new UniqueEntityID('recipient-21')
        })
      ])
    })
  })
})