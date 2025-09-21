import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakerHash: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHash = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHash)
  })
  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johhdoe@xample.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      student: inMemoryStudentsRepository.items[0],
    })
  })
  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johhdoe@xample.com',
      password: '123456',
    })

    const hashedPassword = await fakerHash.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
