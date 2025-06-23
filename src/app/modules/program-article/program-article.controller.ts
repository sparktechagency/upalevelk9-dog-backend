/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';

import sendResponse from '../../../shared/sendResponse';
import { ProgramArticleService } from './program-article.service';
import { IReqUser } from '../user/user.interface';
import { IArticle } from './program-article.interface';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.insertIntoDB(req as any);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs add successful',
    data: result,
  });
});
const getTraining = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IReqUser;
  const result = await ProgramArticleService.getTraining(user, req.query);

  sendResponse<IArticle[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs retrieved successful',
    //@ts-ignore
    data: result.data,
    //@ts-ignore
    meta: result.meta,
  });
});
const getSingleTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.getSingleTraining(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs retrieved successful',
    data: result,
  });
});
const getSingleTrainingByProgram = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProgramArticleService.getSingleTrainingByProgram(req);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Training Programs retrieved successful',
      data: result,
    });
  },
);
const getTrainingByProgram = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.getTrainingByProgram(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Program article retrieved successful',
    data: result,
  });
});
const updateTraining = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.updateTraining(req as any);

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
const swapArticleOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramArticleService.swapArticleOrder(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Training Programs order updated successful',
    data: result,
  });
});

export const ProgramArticleController = {
  insertIntoDB,
  getTraining,
  updateTraining,
  deleteTraining,
  getSingleTraining,
  getSingleTrainingByProgram,
  getTrainingByProgram,
  swapArticleOrder,
};
