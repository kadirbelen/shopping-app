import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

import { passwordSchema, registerSchema } from '../../src/validations/user.validation';

const emailSchema = registerSchema.pick({ email: true });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let adminEmail: string;
let adminPassword: string;

rl.question('-> What is the administrator email: ', function (email: any) {
  const emailValidation = emailSchema.safeParse({ email });

  if (!emailValidation.success) {
    console.log(emailValidation.error.errors[0].message);
    process.exit();
  }

  adminEmail = email;

  rl.question('-> What is the administrator password: ', function (password: any) {
    const passwordValidation = passwordSchema.safeParse(password);

    if (!passwordValidation.success) {
      console.log(passwordValidation.error.errors[0].message);
      process.exit();
    }

    adminPassword = password;

    rl.close();
  });
});

rl.on('close', async function () {
  if (!adminEmail || !adminPassword) process.exit();

  const prisma = new PrismaClient();

  await prisma.$connect();

  const currentUser = await prisma.user.findFirst({
    where: {
      email: adminEmail,
    },
  });

  if (currentUser) {
    console.log('Email already exists');
    process.exit();
  }

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10)),
      firstName: 'ADMIN',
      lastName: 'ADMIN',
      role: UserRole.ADMIN,
    },
  });

  console.log('\n', 'Registration successfully. You can login using the login details below:');

  console.log('-> Email: ', adminEmail);
  console.log('-> Password: ', adminPassword);
});
