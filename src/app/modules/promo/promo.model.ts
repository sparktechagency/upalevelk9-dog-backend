import { Schema, model } from 'mongoose';

import { IPromo } from './promo.inrerface';

const promoSchema = new Schema<IPromo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    promo: {
      type: Schema.Types.ObjectId,
      ref: 'Promo',
      required: true,
    },

    promo_code: {
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

export const Promo = model<IPromo>('Promo', promoSchema);
