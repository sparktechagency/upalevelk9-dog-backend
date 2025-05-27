import { model, Schema } from 'mongoose';

const subscriptionShow = new Schema({
  isSubscriptionShow: {
    type: Boolean,
    default: true,
  },
});

export const SubscriptionShow = model('SubscriptionShow', subscriptionShow);
