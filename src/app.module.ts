import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TestModule } from './tests/test.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HealthController } from './health/health.controller';
import { AppLoggerMiddleware } from './middleware/appLogger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground:
        process.env.APP_ENV === 'local' || process.env.APP_ENV === 'staging', // TODOH: test in production
    }),
    AuthModule,
    DatabaseModule,
    EmailModule,
    TestModule,
    UserModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
