import { Types } from 'mongoose';

export type IPromoPackage = {
  title: string;
  items: [];
  status: boolean;
  promo_code: string;
};
export type IPromoItem = {
  promo_package_id: Types.ObjectId | IPromoPackage;
  title: string;
  status: boolean;
};
