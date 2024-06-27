import { Schema, model } from 'mongoose';
import { IArticle } from './program-article.interface';

const programArticleSchema = new Schema<IArticle>(
  {
    article_title: {
      type: String,
      required: true,
    },
    article_name: {
      type: String,
      required: true,
    },
    article_description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },

    training_program: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingProgram',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const ProgramArticle = model('ProgramArticle', programArticleSchema);
