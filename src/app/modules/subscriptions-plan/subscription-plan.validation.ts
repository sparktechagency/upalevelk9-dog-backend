import { z } from 'zod';

const post = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),

    price: z.string({ required_error: 'price is required' }),

    plan_type: z.string({ required_error: 'plan_type is required' }),
    duration: z.string({ required_error: 'duration is required' }),
  }),
});

export const SubscriptionPlanValidation = { post };
