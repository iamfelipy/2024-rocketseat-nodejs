import {expect, test} from 'vitest'
import { AnswerQuestionUseCase } from "./answer-question"
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer';

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer): Promise<void> => {return ;}
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestion.execute({
    authorId: 'author-01',
    content: 'Nova resposta',
    questionId: 'question-01'
  })

  expect(answer.content).toEqual('Nova resposta')
})