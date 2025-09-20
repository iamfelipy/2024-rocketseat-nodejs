import { AttachmentsRepository } from '@/domain/core/application/repositories/attachments-repository'
import { Attachment } from '@/domain/core/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  create(attachment: Attachment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
