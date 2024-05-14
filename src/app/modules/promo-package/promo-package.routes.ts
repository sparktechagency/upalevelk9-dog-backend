import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PromosPlanController } from './promo-package.controller';
const router = express.Router();

router.post('/add', auth(ENUM_USER_ROLE.ADMIN), PromosPlanController.adPromos);

router.post(
  '/add-item',
  auth(ENUM_USER_ROLE.ADMIN),
  PromosPlanController.adPromosItem,
);
router.get(
  '/all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PromosPlanController.getPromos,
);
router.delete(
  '/delete-item/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  PromosPlanController.deletePromosTitle,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  PromosPlanController.deletePromos,
);
router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  PromosPlanController.updatePromosTitle,
);
router.patch(
  '/update-item/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  PromosPlanController.updatePromosItem,
);

export const PromoPackageRoutes = router;
