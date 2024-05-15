import { Schema, model } from 'mongoose';
import { ISchedule } from './schedule.interface';

const scheduleSchema = new Schema<ISchedule>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    meet_link: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
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
export const Schedule = model('Schedule', scheduleSchema);
