import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DashboardOverviewController } from './overview.controller';

const router = Router();
router.get(
  '/total-users-earning',
  auth(ENUM_USER_ROLE.ADMIN),
  DashboardOverviewController.totalUserAndEarning,
);
router.get(
  '/overviews',
  auth(ENUM_USER_ROLE.ADMIN),
  DashboardOverviewController.Analytics,
);
router.get(
  '/purchased-package-list',
  auth(ENUM_USER_ROLE.ADMIN),
  DashboardOverviewController.purchasedPackageList,
);
export const DashboardOverviewRoutes = router;
