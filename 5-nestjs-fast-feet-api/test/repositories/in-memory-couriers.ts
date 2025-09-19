import { PaginationParams } from '@/core/repositories/pagination-params'
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

  async save(courier: Courier) {
    const itemsIndex = this.items.findIndex(item => item.id.toString() === courier.id.toString())

    this.items[itemsIndex] = courier
  }

  async delete(courier: Courier) {
    const itemsIndex = this.items.findIndex(item => item.id.toString() === courier.id.toString())
    
    this.items.splice(itemsIndex, 1)
  }

  async findMany({page}: PaginationParams) {
    const couriers = this.items
      // .sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
      .splice((page - 1) * 20, page * 20)

    return couriers
  }

}
