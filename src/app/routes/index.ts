import express from 'express';
import { PostRoutes } from '../modules/posts/post.routes';
import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { SubscriptionPlanRoutes } from '../modules/subscriptions-plan/subscriptions-plan.routes';
import { MessageRoutes } from '../modules/messages/message.routes';
import { SubscriptionRoutes } from '../modules/subscriptions/subscriptions.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { NotificationRoutes } from '../modules/notifications/notifications.routes';
import { TrainingRoutes } from '../modules/training-programs/training-programs.routes';
import { ScheduleRoutes } from '../modules/schedule/schedule.routes';
import { DashboardOverviewRoutes } from '../modules/overview/overview.routes';
import { ProgramArticleRoutes } from '../modules/program-article/program-article.routes';
import { PromoPackageRoutes } from '../modules/promo-package/promo-package.routes';
import { PromoRoutes } from '../modules/promo/promo.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/post',
    route: PostRoutes,
  },
  {
    path: '/manage',
    route: ManageRoutes,
  },
  {
    path: '/subscription-plan',
    route: SubscriptionPlanRoutes,
  },
  {
    path: '/subscriptions',
    route: SubscriptionRoutes,
  },
  {
    path: '/promo-package',
    route: PromoPackageRoutes,
  },
  {
    path: '/promo',
    route: PromoRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/message',
    route: MessageRoutes,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
  {
    path: '/training',
    route: TrainingRoutes,
  },
  {
    path: '/program-article',
    route: ProgramArticleRoutes,
  },
  {
    path: '/schedule',
    route: ScheduleRoutes,
  },
  {
    path: '/overview',
    route: DashboardOverviewRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
