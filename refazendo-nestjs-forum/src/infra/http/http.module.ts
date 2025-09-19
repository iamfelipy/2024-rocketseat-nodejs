import { Module } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller'
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller'
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-questions.controller'

@Module({
  controllers: [
    CreateAccountController,
    CreateQuestionController,
    AuthenticateController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
