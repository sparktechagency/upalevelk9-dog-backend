import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PromoController } from './promo.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { PromoValidation } from './promo.validation';
const router = Router();

router.post(
  '/unlock',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(PromoValidation.post),
  PromoController.insertIntoDB,
);

export const PromoRoutes = router;
