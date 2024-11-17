import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupParam {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
