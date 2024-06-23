// import { Schema, model } from 'mongoose';
// import { IPromoPackage, IPromoItem } from './promo-package.interface';

// const promoSchema = new Schema<IPromoPackage>(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     items: [
//       {
//         title: {
//           type: String,
//         },
//       },
//     ],
//     duration: {
//       type: Number,
//       default: 12,
//     },
//     status: {
//       type: Boolean,
//       default: true,
//     },

//     promo_code: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true,
//     },
//   },
// );

// const promoItemSchema = new Schema<IPromoItem>(
//   {
//     promo_package_id: {
//       type: Schema.Types.ObjectId,
//       ref: 'PromoPackage',
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true,
//     },
//   },
// );
// export const PromoPackage = model<IPromoPackage>('PromoPackage', promoSchema);
// export const PromoItem = model<IPromoItem>('PromoItem', promoItemSchema);
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

const promoPackageSchema = new Schema<IPromoPackage, PromoPackageModel>(
  {
    promoPackageName: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    promoCode: {
      type: String,
      required: true,
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
    promoPackageName: this.promoPackageName,
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
