import { Request } from 'express';
import ApiError from '../../../errors/ApiError';
import Notification from '../notifications/notifications.model';
import { PromoPackage } from '../promo-package/promo-package.model';
import User from '../user/user.model';
import { Promo } from './promo.model';
import { IReqUser } from '../user/user.interface';
import { IPromo } from './promo.inrerface';

const insertIntoDB = async (req: Request) => {
  const payload = req.body as IPromo;
  const users = req.user as IReqUser;
  const user = users?.userId;
  const { promo_code } = payload;
  const isExistUser = await User.findById(user);

  if (!isExistUser) {
    throw new ApiError(404, 'User does not exist');
  }
  isExistUser.isPaid = true;
  isExistUser.isSubscribed = true;
  const checkAlreadyUnlock = await Promo.findOne({ user });

  const isExistPackage = await PromoPackage.findOne({
    promoCode: promo_code,
    status: true,
  });

  if (!isExistPackage) {
    throw new ApiError(404, 'Package not found');
  }

  if (checkAlreadyUnlock && checkAlreadyUnlock.user == (user as any)) {
    throw new ApiError(500, 'You are already unlock this package');
  }
  if (promo_code !== isExistPackage.promoCode) {
    throw new ApiError(500, 'Invalid promo code');
  }
  const startDate = new Date();
  const endDate = new Date(
    startDate.getTime() + isExistPackage.packageDuration * 24 * 60 * 60 * 1000,
  );
  const notification = new Notification({
    user: user,
    title: 'Promo Package Unlocked',
    message: `You have successfully unlocked the promo package: ${isExistPackage.promoPackageName}.`,
    status: false,
  });
  payload.promo = isExistPackage._id;
  payload.startDate = startDate;
  payload.endDate = endDate;
  payload.user = user as any;
  await notification.save();
  const result = await Promo.create(payload);
  if (result) {
    await isExistUser.save();
  }
  return result;
};

export const PromoService = { insertIntoDB };
