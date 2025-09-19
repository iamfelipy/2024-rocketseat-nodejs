import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientsRepository } from '@/domain/core/application/repositories/recipients-repository'
import { Recipient } from '@/domain/core/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByCPF(cpf: string) {
    const recipient = this.items.find((item) => item.cpf === cpf)

    if (!recipient) {
      return null
    }
    
    return recipient
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex(item => item.id.equals(recipient.id))

    this.items[itemIndex] = recipient
  }

  async findMany({page}: PaginationParams){
    const recipients = this.items.slice((page - 1) * 20, page * 20)

    return recipients
  }

  async delete(recipient: Recipient) {
    const updatedItems = this.items.filter(item => !item.id.equals(recipient.id))

    this.items = [...updatedItems]
  }
}
