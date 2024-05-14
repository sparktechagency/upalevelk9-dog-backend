/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { Training } from './training-programs.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';

const insertIntoDB = async (req: Request) => {
  const { files, body } = req;

  let image = undefined;
  //@ts-ignore
  if (files && files.image) {
    //@ts-ignore
    image = files.image[0].path;
  }

  const result = await Training.create({
    image,
    ...body,
  });
  return result;
};
const getTraining = async (query: Record<string, unknown>) => {
  const trainingQuery = new QueryBuilder(Training.find({}), query)
    .search(['title', 'description'])
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
  const result = await Training.findById(id);
  if (!result) {
    throw new ApiError(404, 'Training Programs not found');
  }
  return result;
};
const updateTraining = async (req: Request) => {
  const { files, body } = req;
  const { id } = req.params;

  let image = undefined;
  //@ts-ignore
  if (files && files.image) {
    //@ts-ignore
    image = files.image[0].path;
  }
  const isExist = await Training.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Training program not found');
  }
  const { ...updateData } = body;
  const result = await Training.findOneAndUpdate(
    { _id: id },
    {
      image,
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
  const isExist = await Training.findById(id);
  if (!isExist) {
    throw new ApiError(404, 'Training program not found');
  }
  return await Training.findByIdAndDelete(id);
};

export const TrainingService = {
  insertIntoDB,
  getTraining,
  updateTraining,
  deleteTraining,
  getSingleTraining,
};
