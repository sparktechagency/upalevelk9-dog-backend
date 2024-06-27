import { z } from 'zod';

const post = z.object({
  body: z.object({
    article_title: z
      .string({
        required_error: 'article_title is required',
      })
      .min(1)
      .max(100),
    article_name: z
      .string({
        required_error: 'article_name is required',
      })
      .min(1)
      .max(1000),
    article_description: z
      .string({
        required_error: 'article_description is required',
      })
      .min(1),
    training_program: z.string({
      required_error: 'training_program  is required',
    }),
  }),
  files: z.object({
    thumbnail: z
      .array(
        z.object({}).refine(() => true, {
          message: 'thumbnail is required',
        }),
      )
      .nonempty({ message: 'Image array cannot be empty' }),
    video: z
      .array(
        z.object({}).refine(() => true, {
          message: 'video is required',
        }),
      )
      .nonempty({ message: 'Image array cannot be empty' }),
  }),
});
const update = z.object({
  body: z.object({
    article_title: z.string({}).optional(),
    article_name: z.string({}).optional(),
    article_description: z.string({}).optional(),
    training_program: z.string({}).optional(),
    end_date: z.string({}).optional(),
    event_type: z.string({}).optional(),

    location: z.string({}).optional(),
    category: z.string({}).optional(),
  }),
  files: z
    .object({
      thumbnail: z.array(z.object({}).refine(() => true, {})).optional(),
      video: z.array(z.object({}).refine(() => true, {})).optional(),
    })
    .optional(),
});
export const ProgramArticleValidation = {
  post,
  update,
};
