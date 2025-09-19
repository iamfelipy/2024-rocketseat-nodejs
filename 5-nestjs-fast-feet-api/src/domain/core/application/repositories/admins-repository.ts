import { Admin } from '../../enterprise/entities/admin'

export interface AdminsRepository {
  findById(id: string): Promise<Admin | null>
  findByCPF(cpf: string): Promise<Admin | null>
  create(admin: Admin): Promise<void>
}