import { z } from 'zod';

const post = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
    promo_code: z.string({ required_error: 'promo_code is required' }),
  }),
});
const update = z.object({
  body: z.object({
    title: z.string({}).optional(),
    promo_code: z.string({}).optional(),
  }),
});

export const PromoPackageValidation = { post, update };
