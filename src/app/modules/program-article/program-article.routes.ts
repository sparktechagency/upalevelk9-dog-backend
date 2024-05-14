import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { ProgramArticleController } from './program-article.controller';

const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  ProgramArticleController.insertIntoDB,
);
router.get(
  '/all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ProgramArticleController.getTraining,
);
router.get(
  '/single/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ProgramArticleController.getSingleTraining,
);
router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  ProgramArticleController.updateTraining,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProgramArticleController.deleteTraining,
);
export const ProgramArticleRoutes = router;
