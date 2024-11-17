import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class User extends BaseModel {
  static tableName = 'users';

  // TODO: validate email
  @Field(() => String)
  email: string;

  password: string;

  @Field(() => String)
  refreshToken: string | null;

  @Field(() => String)
  confirmToken: string;

  confirmTokenCreatedAt: Date;

  @Field(() => String)
  status: UserStatus;
}

export enum UserStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}
