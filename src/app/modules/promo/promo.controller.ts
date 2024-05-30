import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { PromoService } from './promo.service';
import sendResponse from '../../../shared/sendResponse';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await PromoService.insertIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Unlock package successful',
    data: result,
  });
});

export const PromoController = { insertIntoDB };
