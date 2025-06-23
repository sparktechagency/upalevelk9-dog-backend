/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { TrainingService } from './training-programs.service';
import sendResponse from '../../../shared/sendResponse';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TrainingService.insertIntoDB(req as any);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs add successful',
    data: result,
  });
});
const getTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await TrainingService.getTraining(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs retrieved successful',
    data: result.data,
    meta: result.meta,
  });
});
const getSingleTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await TrainingService.getSingleTraining(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs retrieved successful',
    data: result,
  });
});
const updateTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await TrainingService.updateTraining(req as any);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs update successful',
    data: result,
  });
});
const deleteTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await TrainingService.deleteTraining(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs delete successful',
    data: result,
  });
});

export const TrainingController = {
  insertIntoDB,
  getTraining,
  updateTraining,
  deleteTraining,
  getSingleTraining,
};
