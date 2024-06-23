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
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
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
