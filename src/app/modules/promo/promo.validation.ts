import { z } from 'zod';

const post = z.object({
  body: z.object({
    promo: z.string({ required_error: 'Promo ID is required' }),
    promo_code: z.string({ required_error: 'promo_code ID is required' }),
  }),
});

export const PromoValidation = {
  post,
};
