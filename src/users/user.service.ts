import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { User, UserStatus } from 'src/database/models/user.model';

type CreateUserParam = {
  email: string;
  password: string;
  confirmToken: string;
  confirmTokenCreatedAt: Date;
  status: UserStatus;
};

@Injectable()
export class UserService {
  constructor(@Inject('User') private userModel: ModelClass<User>) {}

  async findById(id: number): Promise<User> {
    return await this.userModel.query().findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.query().findOne({ email });
  }

  async create(user: CreateUserParam): Promise<User> {
    return await this.userModel.query().insertAndFetch(user);
  }
}
