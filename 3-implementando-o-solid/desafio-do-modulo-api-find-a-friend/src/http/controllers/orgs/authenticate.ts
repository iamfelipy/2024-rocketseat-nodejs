import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { org } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {
        role: org.role,
      },
      {
        sign: {
          sub: org.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: org.role,
      },
      {
        sign: {
          sub: org.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        // quais rotas do back-end vao ter acesso a esse cookie
        path: '/',
        // encriptado atraves do https, front-end nao vai conseguir ler essa informação no front-end como uma string bruta
        secure: true,
        // só pode ser acessado pelo mesmo dominio
        sameSite: true,
        // diz para o navegador que só pode ser acessado na requisição e resposta, impedi que extensoes no navegador tenham acesso
        // não fica salvo na aba cookies ou de aplication
        httpOnly: true,
      })
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }
}
