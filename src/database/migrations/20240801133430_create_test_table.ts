import { Knex } from 'knex';

const tableName = 'tests';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (t) => {
    // this creates an "id" column that gets autoincremented
    t.increments();
    t.string('name', 20);
    t.string('updated_by', 20);
    t.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    t.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    t.timestamp('deleted_at');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
