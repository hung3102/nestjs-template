import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Model } from 'objection';

ObjectType();
export class BaseModel extends Model {
  @Field(() => ID)
  readonly id: number;

  @Field(() => String)
  updatedBy: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;
}
