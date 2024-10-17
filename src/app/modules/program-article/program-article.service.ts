/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { ProgramArticle } from './program-article.model';
import { IReqUser } from '../user/user.interface';

import httpStatus from 'http-status';
import { CustomRequest } from '../../../interfaces/common';

const insertIntoDB = async (req: CustomRequest) => {
  const { files, body } = req;
  console.log('body', body);
  let thumbnail = undefined;

  if (files && files.thumbnail) {
    thumbnail = `/images/thumbnail/${files.thumbnail[0].filename}`;
  }

  // let video = undefined;

  // if (files && files.video) {
  //   video = `/video/${files.video[0].filename}`;
  // }
  const result = await ProgramArticle.create({
    thumbnail,
    // video,
    ...body,
  });

  return result;
};
const getTraining = async (user: IReqUser, query: Record<string, unknown>) => {
  const trainingQuery = new QueryBuilder(
    ProgramArticle.find({}).populate('training_program'),
    query,
  )
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

//!
const getSingleTraining = async (req: Request) => {
  const { id } = req.params;

  const result = await ProgramArticle.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Training Program not found');
  }
  return result;
};

const getSingleTrainingByProgram = async (req: Request) => {
  const { id } = req.params;

  const result = await ProgramArticle.findOne({ training_program: id });
  if (!result) {
    throw new ApiError(404, 'Training Programs not found');
  }
  return result;
};
const getTrainingByProgram = async (req: Request) => {
  const { id } = req.params;
  const result = await ProgramArticle.find({ training_program: id });
  if (!result) {
    throw new ApiError(404, 'Program article not found');
  }
  return result;
};
const updateTraining = async (req: CustomRequest) => {
  const { files, body } = req;
  console.log(files, body);
  const { id } = req.params;

  let thumbnail = undefined;

  if (files && files.thumbnail) {
    thumbnail = `/images/thumbnail/${files.thumbnail[0].filename}`;
  }

  // let video = undefined;

  // if (files && files.video) {
  //   video = `/video/${files.video[0].filename}`;
  // }
  const isExist = await ProgramArticle.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Training program not found');
  }
  const { ...updateData } = body;
  const result = await ProgramArticle.findOneAndUpdate(
    { _id: id },
    {
      thumbnail,
      // video,
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
