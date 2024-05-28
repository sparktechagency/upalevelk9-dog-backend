import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ScheduleController } from './schedule.controller';

const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  ScheduleController.insertIntoDB,
);
router.get('/all', auth(ENUM_USER_ROLE.ADMIN), ScheduleController.allSchedule);
router.get(
  '/my-schedule',
  auth(ENUM_USER_ROLE.USER),
  ScheduleController.mySchedule,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ScheduleController.deleteSchedule,
);
router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ScheduleController.updateSchedule,
);

export const ScheduleRoutes = router;
