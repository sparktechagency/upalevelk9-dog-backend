import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { SubscriptionController } from './subscriptions.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { SubscriptionsValidation } from './subscriptions.validation';

const router = Router();

router.post(
  '/upgrade-plan',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(SubscriptionsValidation.post),
  SubscriptionController.upgradeSubscription,
);
export const SubscriptionRoutes = router;
