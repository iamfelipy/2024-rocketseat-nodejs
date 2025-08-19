import { Courier } from '../../enterprise/entities/courier'

export interface CouriersRepository {
  findById(id: string): Promise<Courier | null>
  findByCPF(cpf: string): Promise<Courier | null>
  create(courier: Courier): Promise<void>
  save(courier: Courier): Promise<void>
  delete(courier: Courier): Promise<void>
}
