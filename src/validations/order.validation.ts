import { z } from 'zod';

export const createSchema = z
  .object({
    address: z.string().max(500),
    orderItems: z.array(
      z
        .object({
          quantity: z.number().positive().default(1),
          productId: z.number().positive(),
        })
        .strict(),
    ),
  })
  .strict();
