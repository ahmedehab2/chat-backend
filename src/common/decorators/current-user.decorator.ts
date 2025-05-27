import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    } else if (ctx.getType<GqlContextType>() === 'graphql') {
      const context = GqlExecutionContext.create(ctx).getContext();
      return context.req.user;
    }
  },
);
