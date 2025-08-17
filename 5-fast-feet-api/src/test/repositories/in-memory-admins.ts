import { AdminsRepository } from "@/domain/core/application/repositories/admins-repository"
import { Admin } from "@/domain/core/enterprise/entities/admin"

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByCPF(cpf: string) {
    const admin = this.items.find((item) => item.cpf === cpf)

    if (!admin) {
      return null
    }
    
    return admin
  }

  async create(admin: Admin) {
    this.items.push(admin)
  }


}
