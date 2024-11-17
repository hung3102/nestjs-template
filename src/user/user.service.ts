import { Inject, Injectable } from '@nestjs/common';
import { ModelClass, Transaction } from 'objection';
import { User, UserStatus } from 'src/database/models/user.model';

type CreateUserParam = {
  email: string;
  password: string;
  status: UserStatus;
};

@Injectable()
export class UserService {
  constructor(@Inject('User') private userModel: ModelClass<User>) {}

  async findById(trx: Transaction, id: number): Promise<User> {
    return await this.userModel.query(trx).findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.query().findOne({ email });
  }

  async create(trx: Transaction, user: CreateUserParam): Promise<User> {
    return await this.userModel.query(trx).insertAndFetch(user);
  }
}
