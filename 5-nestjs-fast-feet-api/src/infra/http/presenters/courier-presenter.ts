import { Courier } from '@/domain/core/enterprise/entities/courier'

export class CourierPresenter {
  static toHTTP(courier: Courier) {
    return {
      id: courier.id.toString(),
      roles: courier.roles,
      name: courier.name,
      cpf: courier.cpf,
      address: courier.location.address,
      latitude: courier.location.latitude,
      longitude: courier.location.longitude,
      createdAt: courier.createdAt,
      updatedAt: courier.updatedAt,
    }
  }
}
