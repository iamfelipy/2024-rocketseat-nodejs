import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists'

interface OrgsUseCaseRequest {
  name: string
  email: string
  password: string
  address: string
  whatsapp: string
}
interface OrgsUseCaseRespobnse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    address,
    whatsapp,
  }: OrgsUseCaseRequest): Promise<OrgsUseCaseRespobnse> {
    const orgAlreadyExists = await this.orgsRepository.findByEmail(email)

    if (orgAlreadyExists) {
      throw new OrgAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      address,
      whatsapp,
    })

    return {
      org,
    }
  }
}
