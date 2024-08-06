import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TestResolver } from './test.resolver';

@Module({
  controllers: [TestController],
  providers: [TestService, TestResolver],
})
export class TestModule {}
