import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ManageController } from './manage.controller';
import { uploadFile } from '../../middlewares/fileUploader';
const router = express.Router();

router.post(
  '/add-about-us',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addAboutUs,
);
router.post('/add-faq', auth(ENUM_USER_ROLE.ADMIN), ManageController.addFAQ);
router.post(
  '/add-terms-conditions',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addTermsConditions,
);
router.post(
  '/add-contact-us',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addContactUs,
);
router.post(
  '/add-privacy-policy',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addPrivacyPolicy,
);
router.post(
  '/add-slider',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  ManageController.addSlider,
);
router.get(
  '/get-privacy-policy',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ManageController.getPrivacyPolicy,
);
router.get(
  '/get-slider',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ManageController.getSlider,
);
router.get(
  '/get-faq',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ManageController.getFAQ,
);
router.get(
  '/get-about-us',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ManageController.getAboutUs,
);
router.get(
  '/get-terms-conditions',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ManageController.getTermsConditions,
);
router.get(
  '/get-contact-us',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.getContactUs,
);
router.patch(
  '/edit-privacy-policy/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editPrivacyPolicy,
);
router.patch(
  '/edit-slider/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  ManageController.editSlider,
);
router.patch(
  '/edit-faq/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editFAQ,
);
router.patch(
  '/edit-about-us/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editAboutUs,
);
router.patch(
  '/edit-terms-conditions/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editTermsConditions,
);
router.patch(
  '/edit-contact-us/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editContactUs,
);
router.delete(
  '/delete-about-us/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteAboutUs,
);
router.delete(
  '/delete-slider/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteSlider,
);
router.delete(
  '/delete-faq/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteFAQ,
);
router.delete(
  '/delete-contact-us/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteContactUs,
);
router.delete(
  '/delete-privacy-policy/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deletePrivacyPolicy,
);
router.delete(
  '/delete-terms-conditions/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteTermsConditions,
);
export const ManageRoutes = router;
