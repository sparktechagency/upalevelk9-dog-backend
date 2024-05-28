import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { IReqUser } from '../user/user.interface';
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
const mySchedule = async (user: IReqUser, query: Record<string, unknown>) => {
  const userId = user?.userId;
  // const schedule = await Schedule.findOne({
  //   users: { $all: [userId] },
  // }).populate('users');
  // return schedule;
  const postQuery = new QueryBuilder(
    Schedule.find({ users: { $all: [userId] } }).populate('users'),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    data: result,
  };
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
