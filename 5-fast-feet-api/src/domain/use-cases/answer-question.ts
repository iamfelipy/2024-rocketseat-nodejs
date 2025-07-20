import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository){}

  async execute({authorId, questionId, content}: AnswerQuestionUseCaseRequest){
    const answer = new Answer({content, authorId, questionId})

    await this.answersRepository.create(answer)
    return answer
  }
}