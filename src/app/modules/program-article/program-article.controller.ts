import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';

import sendResponse from '../../../shared/sendResponse';
import { ProgramArticleService } from './program-article.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.insertIntoDB(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs add successful',
    data: result,
  });
});
const getTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.getTraining(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs retrieved successful',
    data: result.data,
    meta: result.meta,
  });
});
const getSingleTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.getSingleTraining(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs retrieved successful',
    data: result,
  });
});
const updateTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.updateTraining(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs update successful',
    data: result,
  });
});
const deleteTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.deleteTraining(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs delete successful',
    data: result,
  });
});

export const ProgramArticleController = {
  insertIntoDB,
  getTraining,
  updateTraining,
  deleteTraining,
  getSingleTraining,
};
