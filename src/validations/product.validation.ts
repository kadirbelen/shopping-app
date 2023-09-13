import { z } from 'zod';

export const createSchema = z
  .object({
    name: z.string().max(255),
    price: z.number().positive(),
    stock: z.number().int().positive().min(1),
  })
  .strict();

export const updateSchema = z
  .object({
    name: z.string().max(255).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(1).positive().optional(),
  })
  .strict()
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    { message: 'At least one field is required: name, price, stock' },
  );
