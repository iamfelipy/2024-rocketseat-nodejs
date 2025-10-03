import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract findById(id: string): Promise<Admin | null>
  abstract findByCPF(cpf: string): Promise<Admin | null>
  abstract create(admin: Admin): Promise<void>
}
