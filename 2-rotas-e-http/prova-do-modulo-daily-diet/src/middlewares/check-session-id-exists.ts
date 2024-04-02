import { FastifyReply, FastifyRequest } from 'fastify'
import { users } from '../datatmp/datatmp'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // verificar se o sessionId está no cookies
  // verificar se existe o usuario do session id

  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  const user = users.find((user) => user.session_id === sessionId)

  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  request.user = user
}
