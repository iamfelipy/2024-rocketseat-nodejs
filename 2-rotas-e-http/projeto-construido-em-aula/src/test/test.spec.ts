import {
  test,
  it,
  expect,
  beforeAll,
  afterAll,
  describe,
  beforeEach,
} from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    // aguardar todos os plugins seem cadastrados
    await app.ready()
  })

  afterAll(async () => {
    // fechar a aplicação, remover da memoria
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  // alternativa ao test
  // escrita como se estivesse escrevendo requisitos funcionais
  it('should be able to create a new trasaction', async () => {
    // test('User can create a new trasaction', async () => {
    // forma 1 de executar

    // const response = await request(app.server).post('/transactions').send({
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
      // sintaxe exclusiva do super test
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    //   //forma 1 de validar objetos de array
    //   expect(listTransactionsResponse.body).toEqual([
    //   {
    //     id: expect.any(String),
    //   },
    // ])
    // forma 2 de validar objetos
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  test('should be able to get a specific transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })

  // it.only('só quero testar esse', () => {})
  it.skip('pula o teste atual, enquanto posso testar outros e ir desenvolvedo aos poucos', () => {})
  it.todo(
    'esse método todo é para me lembrar de um teste que devo fazer no futuro',
  )
})
