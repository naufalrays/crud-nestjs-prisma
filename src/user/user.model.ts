import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  name: string;
  password: string;
  username: string;
  email: string;
}
