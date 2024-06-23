import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { ScheduleService } from './schedule.service';
import sendResponse from '../../../shared/sendResponse';
import { IReqUser } from '../user/user.interface';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule add successful',
    data: result,
  });
});
const allSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.allSchedule(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule retrieved successful',
    data: result.data,
    meta: result.meta,
  });
});
const mySchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.mySchedule(
    req.user as IReqUser,
    req.query,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule retrieved successful',
    data: result.data,
    meta: result.meta,
  });
});
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.deleteSchedule(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule delete successful',
    data: result,
  });
});
const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.updateSchedule(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Schedule retrieved successful',
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
  mySchedule,
  allSchedule,
  deleteSchedule,
  updateSchedule,
};
