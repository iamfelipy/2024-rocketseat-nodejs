import { CouriersRepository } from '@/domain/core/application/repositories/courier-repository'
import { Courier } from '@/domain/core/enterprise/entities/courier'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async findById(id: string) {
    const courier = this.items.find((item) => item.id.toString() === id)

    if (!courier) {
      return null
    }

    return courier
  }

  async findByCPF(cpf: string) {
    const courier = this.items.find((item) => item.cpf === cpf)

    if (!courier) {
      return null
    }
    
    return courier
  }

  async create(courier: Courier) {
    this.items.push(courier)
  }


}
