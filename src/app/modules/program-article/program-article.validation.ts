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
      .min(1)
      .max(1000),
    training_program: z.string({
      required_error: 'training_program  is required',
    }),
    end_date: z.string({
      required_error: 'end_date  is required',
    }),
    event_type: z.string({
      required_error: 'event_type is required',
    }),

    location: z.string({
      required_error: 'location  is required',
    }),
    category: z.string({
      required_error: 'category is required',
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
    video_thumbnail: z
      .array(
        z.object({}).refine(() => true, {
          message: 'video_thumbnail is required',
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
      video_thumbnail: z.array(z.object({}).refine(() => true, {})).optional(),
    })
    .optional(),
});
export const ProgramArticleValidation = {
  post,
  update,
};
