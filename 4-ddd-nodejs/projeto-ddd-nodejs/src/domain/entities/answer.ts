import { randomUUID } from "node:crypto"

interface AnswerProps {
  content: string
  authorId: string
  questionId: string
}

export class Answer {
  public id: string
  public content: string
  public authorId: string
  public questionId: string

  constructor(props: AnswerProps, id?: string) {
    this.authorId = props.authorId
    this.questionId = props.questionId
    this.content = props.content
    this.id = id ?? randomUUID()
  }
}