import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PromoController } from './promo.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { PromoValidation } from './promo.validation';
const router = Router();

router.post(
  '/unlock',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(PromoValidation.post),
  PromoController.insertIntoDB,
);

export const PromoRoutes = router;
