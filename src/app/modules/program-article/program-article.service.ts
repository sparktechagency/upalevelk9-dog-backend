/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { ProgramArticle } from './program-article.model';
import { IReqUser } from '../user/user.interface';
import Admin from '../admin/admin.model';
import { userSubscription } from '../../../utils/Subscription';
import httpStatus from 'http-status';
import { Promo } from '../promo/promo.model';

const insertIntoDB = async (req: Request) => {
  const { files, body } = req;

  let thumbnail = undefined;
  //@ts-ignore
  if (files && files.thumbnail) {
    //@ts-ignore
    thumbnail = `/images/thumbnail/${files.thumbnail[0].filename}`;
  }
  let video_thumbnail = undefined;
  //@ts-ignore
  if (files && files.video_thumbnail) {
    //@ts-ignore
    video_thumbnail = `/images/video_thumbnail/${files.video_thumbnail[0].path}`;
  }
  let video = undefined;
  //@ts-ignore
  if (files && files.video) {
    //@ts-ignore
    video = `/video/${files.video[0].filename}`;
  }
  const result = await ProgramArticle.create({
    thumbnail,
    video_thumbnail,
    video,
    ...body,
  });

  return result;
};
const getTraining = async (user: IReqUser, query: Record<string, unknown>) => {
  const { role } = user;
  if (role === 'ADMIN') {
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
  }
  if (role === 'USER') {
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
  }
};
//!
// const getSingleTraining = async (req: Request) => {
//   const { id } = req.params;
//   const isExistUser = await Admin.findById(req?.user?.userId);
//   const isSubscribed = await userSubscription(req?.user?.userId);

//   if (isSubscribed || isExistUser) {
//     const result = await ProgramArticle.findById(id);
//     if (!result) {
//       throw new ApiError(404, 'Training Programs not found');
//     }
//     return result;
//   } else {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'Please Subscribe For Access Training Programs',
//     );
//   }
// };
//!
const getSingleTraining = async (req: Request) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  const isExistUser = await Admin.findById(userId);
  const isSubscribed = await userSubscription(userId);

  const havePromo = await Promo.findOne({ user: userId });
  const isPromoActive = havePromo && havePromo.status === 'active';

  if (
    isExistUser?.role === 'ADMIN' ||
    (isSubscribed && isSubscribed.status === 'active') ||
    isPromoActive
  ) {
    const result = await ProgramArticle.findById(id);
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Training Program not found');
    }
    return result;
  } else {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Please subscribe or activate a promotion to access Training Programs',
    );
  }
};

const getSingleTrainingByProgram = async (req: Request) => {
  const { id } = req.params;
  const isExistUser = await Admin.findById(req?.user?.userId);
  const isSubscribed = await userSubscription(req?.user?.userId);
  if (isSubscribed || isExistUser) {
    const result = await ProgramArticle.findOne({ training_program: id });
    if (!result) {
      throw new ApiError(404, 'Training Programs not found');
    }
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please Subscribe For Access Training Programs',
    );
  }
};
const getTrainingByProgram = async (req: Request) => {
  const { id } = req.params;
  const isExistUser = await Admin.findById(req?.user?.userId);
  const isSubscribed = await userSubscription(req?.user?.userId);
  if (isSubscribed || isExistUser) {
    const result = await ProgramArticle.find({ training_program: id });
    if (!result) {
      throw new ApiError(404, 'Program article not found');
    }
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please Subscribe For Access Training Programs',
    );
  }
};
const updateTraining = async (req: Request) => {
  const { files, body } = req;
  const { id } = req.params;

  let thumbnail = undefined;
  //@ts-ignore
  if (files && files.thumbnail) {
    //@ts-ignore
    thumbnail = `/images/thumbnail/${files.thumbnail[0].filename}`;
  }
  let video_thumbnail = undefined;
  //@ts-ignore
  if (files && files.video_thumbnail) {
    //@ts-ignore
    video_thumbnail = `/images/video_thumbnail/${files.video_thumbnail[0].path}`;
  }
  let video = undefined;
  //@ts-ignore
  if (files && files.video) {
    //@ts-ignore
    video = `/video/${files.video[0].filename}`;
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
  getSingleTrainingByProgram,
  getTrainingByProgram,
};
