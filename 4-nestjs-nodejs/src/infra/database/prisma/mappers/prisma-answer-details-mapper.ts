import {
  Answer as PrismaAnswer,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaAnswerDetails = PrismaAnswer & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaAnswerDetailsMapper {
  static toDomain(raw: PrismaAnswerDetails): AnswerDetails {
    return AnswerDetails.create({
      answerId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
