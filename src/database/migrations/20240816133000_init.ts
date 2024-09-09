import { Knex } from 'knex';

const companyTable = 'company';
const jobTable = 'job';

export async function up(knex: Knex) {
  await knex.schema.createTable(companyTable, (t) => {
    t.increments().primary();
    t.string('name', 100).notNullable();
    t.string('logo_path', 500).notNullable();
    t.text('describe').notNullable();
    t.integer('employee_num').notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    t.string('updated_by').notNullable();
    t.timestamp('deleted_at');
  });

  await knex.schema.createTable(jobTable, (t) => {
    t.increments().primary();
    t.string('name', 100).notNullable();
    t.text('detail').notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    t.string('updated_by').notNullable();
    t.timestamp('deleted_at');
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable(companyTable);
  await knex.schema.dropTableIfExists(jobTable);
}
