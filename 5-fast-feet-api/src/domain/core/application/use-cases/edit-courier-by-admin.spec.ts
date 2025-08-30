import { InMemoryAdminsRepository } from "@/test/repositories/in-memory-admins"
import { InMemoryCouriersRepository } from "@/test/repositories/in-memory-couriers"
import { beforeEach, describe, expect, it } from "vitest"
import { makeCourier } from "@/test/factories/make-courier"
import { Location } from "../../enterprise/entities/value-objects/location"
import { UserRole } from "@/core/enums/enum-user-role"
import { makeAdmin } from "@/test/factories/make-admin"
import { NotAuthorizedError } from "@/core/erros/errors/not-authorized-error"
import { EditCourierByAdminUseCase } from "./edit-courier-by-admin"

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryAdminRepository: InMemoryAdminsRepository
let sut: EditCourierByAdminUseCase

describe("Edit Courier by Admin", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository
    inMemoryAdminRepository = new InMemoryAdminsRepository
    sut = new EditCourierByAdminUseCase(inMemoryCouriersRepository, inMemoryAdminRepository)
  })
  it('should be able to edit a courier', async () => {
    const courier = makeCourier({
      cpf: "12345678900",
      password: "initialPassword",
      roles: [UserRole.COURIER],
      name: "Initial Courier",
      location: Location.create({
        address: "Initial Address",
        latitude: 10,
        longitude: 20,
      })
    })
    
    await inMemoryCouriersRepository.create(courier)

    const admin = makeAdmin()
    await inMemoryAdminRepository.create(admin)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      adminId: admin.id.toString(),
      cpf: "98765432100",
      password: "newPassword",
      roles: [UserRole.COURIER, UserRole.ADMIN],
      name: "Updated Courier",
      address: "Updated Address",
      latitude: 30,
      longitude: 40,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCouriersRepository.items[0]).toMatchObject({
      cpf: "98765432100",
      password: "newPassword",
      roles: [UserRole.COURIER, UserRole.ADMIN],
      name: "Updated Courier",
      location: expect.objectContaining({
        address: "Updated Address",
        latitude: 30,
        longitude: 40,
      })
    })
  })

  it('should not allow editing a courier if user is not admin', async () => {
    const courier = makeCourier({
      cpf: "12345678900",
      password: "initialPassword",
      roles: [UserRole.COURIER],
      name: "Initial Courier",
      location: Location.create({
        address: "Initial Address",
        latitude: 10,
        longitude: 20,
      })
    })
    
    await inMemoryCouriersRepository.create(courier)

    // create a fake adminId that does not exist in the admin repository
    const nonAdminId = "non-existent-admin-id"

    const result = await sut.execute({
      courierId: courier.id.toString(),
      adminId: nonAdminId,
      cpf: "98765432100",
      password: "newPassword",
      roles: [UserRole.COURIER, UserRole.ADMIN],
      name: "Updated Courier",
      address: "Updated Address",
      latitude: 30,
      longitude: 40,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })
})