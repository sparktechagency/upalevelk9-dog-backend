import ApiError from '../../../errors/ApiError';
import Notification from '../notifications/notifications.model';
import { PromoPackage } from '../promo-package/promo-package.model';
import User from '../user/user.model';
import { IPromo } from './promo.inrerface';
import { Promo } from './promo.model';

const insertIntoDB = async (payload: IPromo) => {
  const { user, promo, promo_code } = payload;
  const isExistUser = await User.findById(user);
  if (!isExistUser) {
    throw new ApiError(404, 'User does not exist');
  }
  const checkAlreadyUnlock = await Promo.findOne({ user });
  const isExistPackage = await PromoPackage.findOne({
    _id: promo,
    status: true,
  });
  if (!isExistPackage) {
    throw new ApiError(404, 'Package not found');
  }
  if (checkAlreadyUnlock && checkAlreadyUnlock.user == user) {
    throw new ApiError(500, 'You are already unlock this package');
  }
  if (promo_code !== isExistPackage.promo_code) {
    throw new ApiError(500, 'Invalid promo code');
  }
  const notification = new Notification({
    user: user,
    title: 'Promo Package Unlocked',
    message: `You have successfully unlocked the promo package: ${isExistPackage.title}.`,
    status: 'unread',
  });
  await notification.save();
  return await Promo.create(payload);
};

export const PromoService = { insertIntoDB };
