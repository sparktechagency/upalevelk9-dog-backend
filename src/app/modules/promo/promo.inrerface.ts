import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IPromo = {
  status: 'active' | 'inactive';
  promo_code: string;
  plan_id: Types.ObjectId | IPromo;
  user: Types.ObjectId | IUser;
  startDate: Date;
  endDate: Date;
};
