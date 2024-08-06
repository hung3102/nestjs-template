import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Test } from 'src/database/models/test.model';
import { TestService } from './test.service';

@Resolver(() => Test)
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Query(() => Test)
  async test(@Args('id', { type: () => Int }) id: number) {
    return this.testService.getTest(id);
  }
}
