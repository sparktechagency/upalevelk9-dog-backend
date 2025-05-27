import { Router } from 'express';
import SubscriptionShowController from './subscriptionShow.controller';

const router = Router();

router.post('/toggle', SubscriptionShowController.toggleSubscriptionShow);
router.get('/get', SubscriptionShowController.getSubscriptionShow);

export const subscriptionShowRoutes = router;
