// export function getRequestLimit(plan: any) {
//   switch (plan) {
//     case 'basic':
//       return 5;
//     case 'gold':
//       return 10;
//     case 'premium':
//       return Infinity;
//     default:
//       return 3;
//   }

import { Subscription } from '../app/modules/subscriptions/subscriptions.model';

// }
export const userSubscription = async (userId: string) => {
  const isExist = await Subscription.findOne({ user_id: userId });
  if (isExist) {
    return isExist;
  } else {
    return null;
  }
};
