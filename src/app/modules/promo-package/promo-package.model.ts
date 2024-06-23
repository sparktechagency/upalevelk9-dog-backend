import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import {
  IPackageDetails,
  IPromoPackage,
  PromoPackageModel,
} from './promo-package.interface';

const packageDetailSchema = new Schema<IPackageDetails>(
  {
    title: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);
const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
const promoPackageSchema = new Schema<IPromoPackage, PromoPackageModel>(
  {
    packageName: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },

    packageDuration: {
      type: Number,
      default: 12,
    },
    trainingVideo: {
      type: packageDetailSchema,
    },
    communityGroup: {
      type: packageDetailSchema,
    },
    videoLesson: {
      type: packageDetailSchema,
    },
    chat: {
      type: packageDetailSchema,
    },
    program: {
      type: packageDetailSchema,
    },
  },
  { timestamps: true },
);

promoPackageSchema.pre('save', async function (next) {
  const isExist = await PromoPackage.findOne({
    packageName: this.packageName,
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Promo Package already exist!');
  }
  next();
});

export const PromoPackage = model<IPromoPackage, PromoPackageModel>(
  'PromoPackage',
  promoPackageSchema,
);
export const PromoCode = model('PromoCode', promoCodeSchema);
