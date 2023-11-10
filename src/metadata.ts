/* eslint-disable */
export default async () => {
  const t = {};
  return {
    '@nestjs/swagger/plugin': {
      models: [
        [
          import('./payment/payment.dto'),
          {
            CreatePaymentDto: {
              user_id: { required: true, type: () => Number },
              file_name: { required: true, type: () => String },
            },
          },
        ],
      ],
      controllers: [],
    },
    '@nestjs/graphql/plugin': {
      models: [
        [import('./common/models/base.model'), { BaseModel: { id: {}, createdAt: {}, updatedAt: {} } }],
        [
          import('./common/pagination/page-info.model'),
          {
            PageInfo: {
              endCursor: { nullable: true },
              hasNextPage: {},
              hasPreviousPage: {},
              startCursor: { nullable: true },
            },
          },
        ],
        [
          import('./common/pagination/pagination.args'),
          {
            PaginationArgs: {
              skip: { nullable: true, type: () => Number },
              after: { nullable: true, type: () => String },
              before: { nullable: true, type: () => String },
              first: { nullable: true, type: () => Number },
              last: { nullable: true, type: () => Number },
            },
          },
        ],
        [import('./user_bot/dto/change-password.input'), { ChangePasswordInput: { oldPassword: {}, newPassword: {} } }],
        [
          import('./user_bot/dto/update-user.input'),
          { UpdateUserInput: { firstname: { nullable: true }, lastname: { nullable: true } } },
        ],
        [
          import('./user_bot/models/user.model'),
          { User: { phone: {}, name: { nullable: true }, username: { nullable: true }, role: {} } },
        ],
      ],
    },
  };
};
