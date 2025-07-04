import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'

export interface AnswerDetailsProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  answerId: UniqueEntityID
  content: string
  attachments: Attachment[]
  author: string

  createdAt: Date
  updatedAt?: Date | null
}

export class AnswerDetails extends ValueObject<AnswerDetailsProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get answerId() {
    return this.props.answerId
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get author() {
    return this.props.author
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: AnswerDetailsProps) {
    return new AnswerDetails(props)
  }
}
