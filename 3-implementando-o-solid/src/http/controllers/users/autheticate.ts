import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const autheticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = autheticateBodySchema.parse(request.body)

  try {
    const autheticateUseCase = makeAuthenticateUseCase()

    const { user } = await autheticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
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
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
