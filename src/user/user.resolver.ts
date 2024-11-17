import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from 'src/database/models/user.model';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, JWTUser } from 'src/auth/currentUser';
import { LoginGuard } from 'src/auth/guards/login.guard';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(LoginGuard)
  async getUser(@CurrentUser() user: JWTUser): Promise<User> {
    return await this.userService.findById(null, user.id);
  }
}
