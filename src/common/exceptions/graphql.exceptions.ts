import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

import { MongoError } from 'mongodb';
import { errMessages } from '../errors/err-msgs';

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
        throw new BadRequestException(
          errMessages.RESOURCE_ALREADY_EXISTS_GRAPHQL,
        );
      } else {
        throw new BadRequestException(exception.message);
      }
    }

    return exception;
  }
}
