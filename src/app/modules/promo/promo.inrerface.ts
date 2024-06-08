import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IPromo = {
  status: boolean;
  promo_code: string;
  promo: Types.ObjectId | IPromo;
  user: Types.ObjectId | IUser;
  startDate: Date;
  endDate: Date;
};
