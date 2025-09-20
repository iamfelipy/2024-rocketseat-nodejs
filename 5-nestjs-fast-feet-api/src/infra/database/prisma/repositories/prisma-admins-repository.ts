import { AdminsRepository } from '@/domain/core/application/repositories/admins-repository'
import { Admin } from '@/domain/core/enterprise/entities/admin'

export class PrismaAdminsRepository implements AdminsRepository {
  findById(id: string): Promise<Admin | null> {
    throw new Error('Method not implemented.')
  }

  findByCPF(cpf: string): Promise<Admin | null> {
    throw new Error('Method not implemented.')
  }

  create(admin: Admin): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
