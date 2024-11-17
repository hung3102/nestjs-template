import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';

@ObjectType()
export class UserAuth extends BaseModel {
  static tableName = 'user_auth';

  userId: number;
  confirmToken: string;
  confirmTokenCreatedAt: Date;
}
