/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { ProgramArticle } from './program-article.model';
// import { INotification } from '../notifications/notifications.interface';
// import User from '../user/user.model';
// import Notification from '../notifications/notifications.model';

const insertIntoDB = async (req: Request) => {
  const { files, body } = req;

  let thumbnail = undefined;
  //@ts-ignore
  if (files && files.thumbnail) {
    //@ts-ignore
    thumbnail = files.thumbnail[0].path;
  }
  let video_thumbnail = undefined;
  //@ts-ignore
  if (files && files.video_thumbnail) {
    //@ts-ignore
    video_thumbnail = files.video_thumbnail[0].path;
  }
  let video = undefined;
  //@ts-ignore
  if (files && files.video) {
    //@ts-ignore
    video = files.video[0].path;
  }
  const result = await ProgramArticle.create({
    thumbnail,
    video_thumbnail,
    video,
    ...body,
  });
  // const loggedInUsers = await User.find({});

  // // Send notifications to all logged-in users
  // const notifications: INotification[] = loggedInUsers.map(
  //   (user: { _id: any }) => ({
  //     user: user._id,
  //     title: `New Article: ${body.article_title}`,
  //     message: `A new article titled "${body.article_title}" has been posted. Check it out!`,
  //     status: 'unread',
  //   }),
  // );

  // try {
  //   await Notification.insertMany(notifications);
  //   console.log('Notifications sent successfully');
  // } catch (error) {
  //   console.error('Failed to send notifications', error);
  // }

  return result;
};
const getTraining = async (query: Record<string, unknown>) => {
  const trainingQuery = new QueryBuilder(ProgramArticle.find({}), query)
    .search(['article_title', 'article_name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await trainingQuery.modelQuery;
  const meta = await trainingQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
const getSingleTraining = async (id: string) => {
  const result = await ProgramArticle.findById(id);
  if (!result) {
    throw new ApiError(404, 'Training Programs not found');
  }
  return result;
};
const updateTraining = async (req: Request) => {
  const { files, body } = req;
  const { id } = req.params;

  let thumbnail = undefined;
  //@ts-ignore
  if (files && files.thumbnail) {
    //@ts-ignore
    thumbnail = files.thumbnail[0].path;
  }
  let video_thumbnail = undefined;
  //@ts-ignore
  if (files && files.video_thumbnail) {
    //@ts-ignore
    video_thumbnail = files.video_thumbnail[0].path;
  }
  let video = undefined;
  //@ts-ignore
  if (files && files.video) {
    //@ts-ignore
    video = files.video[0].path;
  }
  const isExist = await ProgramArticle.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Training program not found');
  }
  const { ...updateData } = body;
  const result = await ProgramArticle.findOneAndUpdate(
    { _id: id },
    {
      thumbnail,
      video_thumbnail,
      video,
      ...updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};
const deleteTraining = async (req: Request) => {
  const { id } = req.params;
  const isExist = await ProgramArticle.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Training program not found');
  }
  return await ProgramArticle.findByIdAndDelete(id);
};

export const ProgramArticleService = {
  insertIntoDB,
  getTraining,
  updateTraining,
  deleteTraining,
  getSingleTraining,
};
