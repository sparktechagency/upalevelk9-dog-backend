import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { SubscriptionShow } from './subscriptionShow.mode';

const toggleSubscriptionShow = catchAsync(
  async (req: Request, res: Response) => {
    let result = await SubscriptionShow.findOne();

    if (result) {
      result.isSubscriptionShow = !result.isSubscriptionShow;
      await result.save();
    } else {
      result = await SubscriptionShow.create({ isSubscriptionShow: false });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.isSubscriptionShow
        ? 'Now subscription will show'
        : 'Now subscription will not show',
      data: result,
    });
  },
);
const getSubscriptionShow = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionShow.findOne();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subcripiton show get successfully',
    data: result,
  });
});

const SubscriptionShowController = {
  toggleSubscriptionShow,
  getSubscriptionShow,
};

export default SubscriptionShowController;
