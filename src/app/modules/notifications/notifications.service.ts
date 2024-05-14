import { Request } from 'express';
import Notification from './notifications.model';
import ApiError from '../../../errors/ApiError';

//Get
const getNotifications = async () => {
  const result = await Notification.find().sort({ createdAt: -1 });
  return result;
};
//Update
const updateNotification = async (req: Request) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  } else {
    // eslint-disable-next-line no-unused-expressions
    notification.status ? (notification.status = 'read') : notification?.status;
  }
  await notification.save();
  const notifications = await Notification.find().sort({
    createdAt: -1,
  });
  return notifications;
};
const myNotification = async (id: string) => {
  return await Notification.find({ user: id });
};

export const NotificationService = {
  getNotifications,
  updateNotification,
  myNotification,
};
