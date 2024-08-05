import { Knex } from 'knex';
import { Test } from '../models/test.model';

export async function seed(knex: Knex): Promise<any> {
  await knex(Test.tableName).insert([
    {
      name: 'Test 1',
    },
    {
      name: 'Test 2',
    },
  ]);
}
