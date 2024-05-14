import { Schema, model } from 'mongoose';
import { IPromoPackage, IPromoItem } from './promo-package.interface';

const promoSchema = new Schema<IPromoPackage>(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        title: {
          type: String,
        },
      },
    ],

    status: {
      type: Boolean,
      default: true,
    },

    promo_code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const promoItemSchema = new Schema<IPromoItem>(
  {
    promo_package_id: {
      type: Schema.Types.ObjectId,
      ref: 'PromoPackage',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);
export const PromoPackage = model<IPromoPackage>('PromoPackage', promoSchema);
export const PromoItem = model<IPromoItem>('PromoItem', promoItemSchema);
