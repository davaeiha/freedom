import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// eslint-disable-next-line @typescript-eslint/naming-convention
// export const UserEntity = createParamDecorator(
//   (_data: unknown, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req.user,
// );

// export const UserEntity = createParamDecorator
