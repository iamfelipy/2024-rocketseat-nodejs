import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE

app.get('/hello', async () => {
  // fazendo uma busca
  // const tables = await knex('sqlite_schema').select('*')

  // criando um novo registro
  // const transaction = await knex('transactions')
  //   .insert({
  //     id: crypto.randomUUID(),
  //     title: 'Transação de teste',
  //     amount: 1000,
  //   })
  //   .returning('*')

  // return transaction

  // buscando registros
  const transaction = await knex('transactions')
    .where('amount', 500)
    .select('*')

  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
