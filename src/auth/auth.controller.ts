import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('confirm')
  async confirmEmail(@Query('token') token: string): Promise<boolean> {
    return await this.authService.confirmEmail(token);
  }
}
