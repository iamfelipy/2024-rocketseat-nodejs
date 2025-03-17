import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })
  // não vai verificar o header que tem o authorization: bearer
  // vou procurar no cookie se tem o refresh token

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
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
}
