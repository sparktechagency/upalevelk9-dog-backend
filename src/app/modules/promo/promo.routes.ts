import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PromoController } from './promo.controller';
const router = Router();

router.post('/unlock', auth(ENUM_USER_ROLE.USER), PromoController.insertIntoDB);

export const PromoRoutes = router;
