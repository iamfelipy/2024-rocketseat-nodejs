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
}
