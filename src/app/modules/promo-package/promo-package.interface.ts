// import { Types } from 'mongoose';

// export type IPromoPackage = {
//   title: string;
//   items: [];
//   status: boolean;
//   promo_code: string;
//   duration: number;
// };
// export type IPromoItem = {
//   promo_package_id: Types.ObjectId | IPromoPackage;
//   title: string;
//   status: boolean;
// };
import { Model } from 'mongoose';

export type IPackageDetails = { title: string; status: boolean };

export type IPromoPackage = {
  promoPackageName: string;
  packageDuration: number;
  promoCode: string;
  status: boolean;
  trainingVideo?: IPackageDetails;
  communityGroup?: IPackageDetails;
  videoLesson?: IPackageDetails;
  chat?: IPackageDetails;
  program?: IPackageDetails;
};

export type PromoPackageModel = Model<IPromoPackage, Record<string, unknown>>;
