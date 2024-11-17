import { Inject, Injectable } from '@nestjs/common';
import { ModelClass, Transaction } from 'objection';
import { UserAuth } from 'src/database/models/userAuth.model';

type CreateUserAuthParam = {
  confirmToken: string;
  confirmTokenCreatedAt: Date;
  userId: number;
};

@Injectable()
export class UserAuthService {
  constructor(
    @Inject('UserAuth') private userAuthModel: ModelClass<UserAuth>,
  ) {}

  async findByConfirmToken(token: string): Promise<UserAuth | null> {
    return await this.userAuthModel.query().findOne({ confirmToken: token });
  }

  async create(
    trx: Transaction,
    param: CreateUserAuthParam,
  ): Promise<UserAuth> {
    return await this.userAuthModel.query(trx).insertAndFetch(param);
  }
}
