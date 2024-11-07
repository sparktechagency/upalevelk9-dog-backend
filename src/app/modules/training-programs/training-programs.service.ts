import { Request } from 'express';
import { Training } from './training-programs.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { CustomRequest } from '../../../interfaces/common';
import { ProgramArticle } from '../program-article/program-article.model';

const insertIntoDB = async (req: CustomRequest) => {
  const { files, body } = req;

  let image = undefined;

  if (files && files.image) {
    image = `/images/image/${files.image[0].filename}`;
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
const updateTraining = async (req: CustomRequest) => {
  const { files, body } = req;
  const { id } = req.params;

  let image = undefined;

  if (files && files.image) {
    image = `/images/image/${files.image[0].filename}`;
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

  const result = await Training.findByIdAndDelete(id);

  await ProgramArticle.deleteMany({ training_program: id });

  return result;
};

export const TrainingService = {
  insertIntoDB,
  getTraining,
  updateTraining,
  deleteTraining,
  getSingleTraining,
};
