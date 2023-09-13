import { z } from 'zod';

export const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/, {
    message:
      'Password to be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (which can be any of the following: @$!%*?&_ )',
  });

export const registerSchema = z
  .object({
    firstName: z.string().max(255),
    lastName: z.string().max(255),
    email: z.string().email().max(255),
    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email().max(255),
    password: passwordSchema,
  })
  .strict();

export type RegisterPayload = z.infer<typeof registerSchema>;
