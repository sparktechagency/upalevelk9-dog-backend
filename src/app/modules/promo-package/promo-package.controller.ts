import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { PromosPlanService } from './promo-package.service';

//! Admin STart
const adPromos = catchAsync(async (req: Request, res: Response) => {
  const result = await PromosPlanService.addPromo(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'adPromos successfully',
    data: result,
  });
});
const adPromosItem = catchAsync(async (req: Request, res: Response) => {
  const result = await PromosPlanService.addPromoByTitle(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Promos item add successfully',
    data: result,
  });
});
const getPromos = catchAsync(async (req: Request, res: Response) => {
  const result = await PromosPlanService.getPromos();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Promos Retrieved successfully',
    data: result,
  });
});
const deletePromosTitle = catchAsync(async (req: Request, res: Response) => {
  const result = await PromosPlanService.deletePromosTitle(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Promos item delete successfully',
    data: result,
  });
});
const updatePromosTitle = catchAsync(async (req: Request, res: Response) => {
  const result = await PromosPlanService.updatePromosTitle(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Promos Update successfully',
    data: result,
  });
});
const updatePromosItem = catchAsync(async (req: Request, res: Response) => {
  const result = await PromosPlanService.updatePromosItem(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Promos item Update successfully',
    data: result,
  });
});
const deletePromos = catchAsync(async (req: Request, res: Response) => {
  const result = await PromosPlanService.deletePromos(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Promos delete successfully',
    data: result,
  });
});

export const PromosPlanController = {
  adPromos,
  adPromosItem,
  getPromos,
  deletePromosTitle,
  deletePromos,
  updatePromosTitle,
  updatePromosItem,
};
