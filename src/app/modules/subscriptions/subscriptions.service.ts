/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { SubscriptionPlan } from '../subscriptions-plan/subscriptions-plan.model';
import User from '../user/user.model';
import { ISubscription } from './subscriptions.interface';
import { Subscription } from './subscriptions.model';
import { Promo } from '../promo/promo.model';

const upgradeSubscriptionToDB = async (
  user: JwtPayload,
  payload: Partial<ISubscription>,
) => {
  const isExistUser = await User.findById(user.userId);
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const isExistSubscription = await SubscriptionPlan.findById(payload.plan_id);
  if (!isExistSubscription) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Plan doesn't exist!");
  }
  const alreadyHavePlan = await Subscription.findOne({ user_id: user.userId });
  const alreadyHavPromo = await Promo.findOne({ user: user.userId });
  if (alreadyHavePlan) {
    await Subscription.findOneAndDelete({ user_id: user?.userId });
  }
  if (alreadyHavPromo) {
    await Promo.findOneAndDelete({ user: user?.userId });
  }
  isExistUser.isPaid = true;
  isExistUser.isSubscribed = true;
  const startDate = new Date();
  const monthsToAdd = isExistSubscription.packageDuration;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + monthsToAdd);

  const upgradeData = {
    user_id: user.userId,
    plan_id: payload.plan_id,
    startDate,
    endDate,
    payment_status: 'paid',
    status: 'active',
    transaction_id: payload.transaction_id,
    amount: payload.amount,
    plan_type: isExistSubscription?.packageName,
  };

  const result = await Subscription.create(upgradeData);
  if (result) {
    await isExistUser.save();
  }
  return result;
};

const mySubscriptionFromDB = async (user: JwtPayload) => {
  const subscriptions = await Subscription.findOne({
    user_id: user.userId,
  }).populate({
    path: 'plan_id',
    select: '-updatedAt -createdAt -__v',
  });
  const promo = await Promo.findOne({ user: user.userId }).populate({
    path: 'plan_id',
    select: '-updatedAt -createdAt -__v',
  });
  if (promo && promo.status === 'active') {
    return promo;
  } else {
    return subscriptions;
  }
};

export const SubscriptionService = {
  upgradeSubscriptionToDB,
  mySubscriptionFromDB,
};
