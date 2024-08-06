import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class Test extends BaseModel {
  static tableName = 'tests';

  @Field(() => String)
  name: string;
}
