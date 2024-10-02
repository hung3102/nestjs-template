import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { User } from 'src/database/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('User') private userModel: ModelClass<User>) {}

  async findById(id: number): Promise<User> {
    return await this.userModel.query().findById(id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.query().findOne({ email });
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.userModel.query().insert(user);
  }
}
