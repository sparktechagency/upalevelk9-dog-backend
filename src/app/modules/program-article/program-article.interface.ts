import { Types } from 'mongoose';
import { ITraining } from '../training-programs/training-programs.interface';

export type IArticle = {
  article_title: string;
  thumbnail: string;
  video: string;
  video_thumbnail: string;
  article_name: string;
  article_description: string;
  training_program: Types.ObjectId | ITraining;
  serial: number;
};
