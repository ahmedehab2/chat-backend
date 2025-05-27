import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

import { MongoError } from 'mongodb';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private logger = new Logger(GraphQLExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    this.logger.error(`Error occurred: ${exception.message}`, {
      operation: gqlHost.getInfo()?.fieldName,
      variables: gqlHost.getArgs(),
    });
    if (exception instanceof MongoError) {
      if (exception.code === 11000) {
        throw new BadRequestException('Resource already exists');
      } else {
        throw new BadRequestException(exception.message);
      }
    }

    return exception;
  }
}
