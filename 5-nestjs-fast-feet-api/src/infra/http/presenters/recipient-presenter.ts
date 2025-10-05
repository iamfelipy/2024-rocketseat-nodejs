import { Recipient } from '@/domain/core/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      roles: recipient.roles,
      name: recipient.name,
      cpf: recipient.cpf,
      address: recipient.location.address,
      latitude: recipient.location.latitude,
      longitude: recipient.location.longitude,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
