import { z } from 'zod';

const post = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .min(1)
      .max(100),
  }),
  files: z.object({
    image: z
      .array(
        z.object({}).refine(() => true, {
          message: 'Image is required',
        }),
      )
      .nonempty({ message: 'Image array cannot be empty' }),
  }),
});

export const TrainingProgramValidation = {
  post,
};
