import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import JwtAuthenticationGuard from './authentication/jwt-authentication.guard';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthenticationGuard(reflector));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });
  const winston = require('winston');
  const CloudWatchTransport = require('winston-aws-cloudwatch');
  const logger = winston.createLogger({
    transports: [
      new CloudWatchTransport({
        logGroupName: 'nest-logs',
        logStreamName: 'nest-logs-stream',
        createLogGroup: true,
        createLogStream: true,
        submissionInterval: 2000,
        submissionRetryCount: 1,
        batchSize: 20,
        awsConfig: {
          accessKeyId: configService.get('AWS_USER_KEY'),
          secretAccessKey: configService.get('AWS_USER_SECRET'),
          region: 'us-east-1',
        },
      }),
    ],
  });
  logger.info('Hello, CloudWatch!');
  logger.error('An error occurred!');
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
