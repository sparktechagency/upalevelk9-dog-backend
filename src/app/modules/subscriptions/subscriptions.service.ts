/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { SubscriptionPlan } from '../subscriptions-plan/subscriptions-plan.model';
import ApiError from '../../../errors/ApiError';
import { Subscription } from './subscriptions.model';

import User from '../user/user.model';
import { IReqUser } from '../user/user.interface';
import { logger } from '../../../shared/logger';

const upgradeSubscription = async (req: Request) => {
  try {
    const { planId, transactionId, payment_status, payment_id } = req.body;
    const checkUser = await User.findById(req?.user?.userId);

    if (!checkUser) {
      throw new ApiError(404, 'User not found');
    }

    const subscriptionPlan = await SubscriptionPlan.findById(planId);
    if (!subscriptionPlan) {
      throw new ApiError(404, 'Plan not found');
    }
    checkUser.isPaid = true;
    checkUser.isSubscribed = true;
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + subscriptionPlan.duration * 24 * 60 * 60 * 1000,
    );

    const subscription = await Subscription.create({
      plan_id: planId,
      user_id: req?.user?.userId,
      payment_id,
      payment_status: payment_status,
      startDate,
      endDate,
      transactionId: transactionId,
    });
    await checkUser.save();
    return subscription;
  } catch (error) {
    //@ts-ignore
    logger.log(error.message);
    //@ts-ignore
    throw new Error(error?.message);
  }
};
const mySubscription = async (user: IReqUser) => {
  return await Subscription.find({ user_id: user?.userId });
};

export const SubscriptionService = {
  upgradeSubscription,
  mySubscription,
};
