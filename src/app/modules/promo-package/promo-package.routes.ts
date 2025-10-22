import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PromosPlanController } from './promo-package.controller';

const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  // validateRequest(PromoPackageValidation.post),
  PromosPlanController.adPromos,
);
router.post(
  '/add-promo-code',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  // validateRequest(PromoPackageValidation.post),
  PromosPlanController.addPromoCode,
);

router.get(
  '/all',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  PromosPlanController.getPromos,
);
router.get(
  '/all-codes',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PromosPlanController.getPromoCodes,
);

router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PromosPlanController.deletePromos,
);
router.delete(
  '/delete-code/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PromosPlanController.deletePromoCode,
);
router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  // validateRequest(PromoPackageValidation.update),
  PromosPlanController.updatePromoPackage,
);

export const PromoPackageRoutes = router;
