import { Schema, model } from 'mongoose';
import { ITraining } from './training-programs.interface';

const trainingSchema = new Schema<ITraining>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    serial: {
      type: Number,
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

export const Training = model('TrainingProgram', trainingSchema);
