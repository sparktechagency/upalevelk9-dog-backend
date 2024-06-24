import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { ProgramArticleController } from './program-article.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { ProgramArticleValidation } from './program-article.validation';

const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  validateRequest(ProgramArticleValidation.post),
  ProgramArticleController.insertIntoDB,
);
router.get(
  '/all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN),
  ProgramArticleController.getTraining,
);
router.get(
  '/details/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN),
  ProgramArticleController.getSingleTraining,
);
// router.get(
//   '/article-detail/:id',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
//   ProgramArticleController.getSingleTrainingByProgram,
// );
router.get(
  '/program-articles/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN),
  ProgramArticleController.getTrainingByProgram,
);
router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  validateRequest(ProgramArticleValidation.update),
  ProgramArticleController.updateTraining,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ProgramArticleController.deleteTraining,
);
export const ProgramArticleRoutes = router;
