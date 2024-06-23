import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import Notification from '../notifications/notifications.model';
import { IReqUser } from '../user/user.interface';
import User from '../user/user.model';
import { ISchedule } from './schedule.interface';
import { Schedule } from './schedule.model';

const insertIntoDB = async (payload: ISchedule) => {
  if (!payload.meet_link || !payload.date || !payload.time) {
    throw new ApiError(500, 'Meet link, Date and Time is Required');
  }

  let userIds = [];

  if (payload.users) {
    userIds = payload.users;

    // Find users based on payload.users array
    const users = await User.find({ _id: { $in: userIds } });

    if (users.length !== userIds.length) {
      throw new ApiError(404, 'Some users not found');
    }

    // Create notifications for each user
    const notifications = users.map(user => ({
      user: user._id,
      title: 'New Schedule Created',
      message: 'A new schedule has been created for you.',
      status: false,
    }));

    // Save notifications
    await Notification.insertMany(notifications);
  }

  // Create the schedule in the database
  const schedule = await Schedule.create(payload);

  return schedule;
};

const allSchedule = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Schedule.find({}), query).search(['date']);
  const result = await postQuery.modelQuery;
  const meta = await postQuery.countTotal();

  return {
    meta,
    data: result,
  };
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
