import { faker } from '@faker-js/faker';
import { Prisma, UserRole } from '@prisma/client';

import prisma from './prisma-client.util';

export const TEST_PASSWORDS = {
  KBuser52: {
    plain: 'KBuser52',
    hashed: '$2a$10$r24/fT7lV9PjKrQF0IEuZevjLSAnP8BHg0DCqPJ3/Xp7OMGqo1gWK',
  },
};

export function generateUserData(): Prisma.UserCreateInput {
  return {
    email: faker.internet.email(),
    password: TEST_PASSWORDS.KBuser52.plain,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: UserRole.CUSTOMER,
  };
}

export async function createDummyUser(maxUserCount: number) {
  const users = [];
  for (let index = 0; index < maxUserCount; index++) {
    const user = await prisma.user.create({
      data: generateUserData(),
    });

    users.push(user);
  }

  return users;
}
