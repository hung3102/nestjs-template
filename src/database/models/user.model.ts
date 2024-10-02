import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class User extends BaseModel {
  static tableName = 'users';

  // TODO: validate email
  @Field(() => String)
  email: string;

  password: string;
  refreshToken: string | null;
}
