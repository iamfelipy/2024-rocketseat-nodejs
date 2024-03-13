import { test, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  // fechar a aplicação, remover da memoria
  await app.close()
})

test('User can create a new trasaction', async () => {
  // forma 1 de executar

  // const response = await request(app.server).post('transactions').send({
  //   title: 'New transaction',
  //   amount: 5000,
  //   type: 'credit',
  // })

  // expect(response.statusCode).toEqual(201)

  // forma 2 de executar

  await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })
    .expect(201)
})
