import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    // table.increments() alternativa não recomendada para id
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    // a definição de data defaultTo vai funcionar em todos os tipos de banco
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    // maneira fixa de definir a função que gera a DataTransfer, não recomendavel, padrão para o mysql
    // table.timestamp('created_at').defaultTo('NOW()').notNullable()
    // maneira fixa de definir a função que gera a DataTransfer, não recomendavel, padrão para o sqlite,postgress
    // table.timestamp('created_at').defaultTo('CURRENT_TIMESTAMP').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
