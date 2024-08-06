import { Controller, Get, Param } from '@nestjs/common';
import { TestService } from './test.service';
import { Test } from 'src/database/models/test.model';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get(':id')
  async getTest(@Param('id') id: number): Promise<Test> {
    return await this.testService.getTest(id);
  }
}
