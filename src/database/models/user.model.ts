import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UserAuth } from './userAuth.model';

@ObjectType()
export class User extends BaseModel {
  static tableName = 'user';

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

  static get relationMappings() {
    return {
      userAuths: {
        relation: Model.HasManyRelation,
        modelClass: UserAuth,
        join: {
          from: 'user.id',
          to: 'user_auth.user_id',
        },
      },
    };
  }
}

export enum UserStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}
