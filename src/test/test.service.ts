import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { Test } from 'src/database/models/test.model';

@Injectable()
export class TestService {
  constructor(@Inject('Test') private modelClass: ModelClass<Test>) {}

  async getTest(id: number): Promise<Test> {
    return await this.modelClass.query().findById(id);
  }
}
