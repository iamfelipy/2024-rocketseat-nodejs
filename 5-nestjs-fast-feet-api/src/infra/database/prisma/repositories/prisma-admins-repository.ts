import { AdminsRepository } from '@/domain/core/application/repositories/admins-repository'
import { Admin } from '@/domain/core/enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { UserRole } from '@/core/enums/enum-user-role'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Admin | null> {
    // Only fetch user if roles contains 'ADMIN'
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
        roles: {
          has: UserRole.ADMIN,
        },
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
        roles: {
          has: UserRole.ADMIN,
        },
      },
    })

    if (!admin) {
      return null
    }
    return PrismaAdminMapper.toDomain(admin)
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }
}
