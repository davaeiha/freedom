import { Prisma } from '@prisma/client';

// type AdminPymentMessageWithAmin = Prisma.validator<Prisma.UserDefaultArgs>;

const adminPymentMessageWithAmin = Prisma.validator<Prisma.AdminPaymentMessagesDefaultArgs>()({
  include: { admin: true },
});

export type AdminPymentMessageWithAmin = Prisma.AdminPaymentMessagesGetPayload<typeof adminPymentMessageWithAmin>;
