import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchasync';
import { NotificationService } from './notifications.service';

//get notification only for admin
const getNotifications: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationService.getNotifications();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Notification retrieved successfully`,
      data: result,
    });
  },
);
//update notification only for admin
const updateNotification: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationService.updateNotification(req);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Notification updated successfully`,
      data: result,
    });
  },
);
const myNotification: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationService.myNotification(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Notification retrieved successfully`,
      data: result,
    });
  },
);

export const NotificationController = {
  getNotifications,
  updateNotification,
  myNotification,
};
