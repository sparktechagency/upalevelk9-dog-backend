import ApiError from '../../../errors/ApiError';
import { ISchedule } from './schedule.interface';
import { Schedule } from './schedule.model';

export const insertIntoDB = async (payload: ISchedule) => {
  if (!payload.meet_link || !payload.password) {
    throw new ApiError(500, 'Meet link and password is required');
  }
  return await Schedule.create(payload);
};

const allSchedule = async () => {
  return await Schedule.find();
};
const mySchedule = async (id: string) => {
  const schedule = await Schedule.findOne({
    users: { $all: [id] },
  }).populate('users');
  return schedule;
};
const deleteSchedule = async (id: string) => {
  const isExist = await Schedule.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Schedule not found');
  }
  return await Schedule.findByIdAndDelete(id);
};
const updateSchedule = async (id: string, payload: Partial<ISchedule>) => {
  const isExist = await Schedule.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Schedule not found');
  }
  return await Schedule.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

export const ScheduleService = {
  insertIntoDB,
  allSchedule,
  mySchedule,
  deleteSchedule,
  updateSchedule,
};
