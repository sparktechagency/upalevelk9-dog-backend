import { z } from 'zod';

const post = z.object({
  body: z.object({
    promo_code: z.string({ required_error: 'promo_code ID is required' }),
  }),
});

export const PromoValidation = {
  post,
};
