import cron from 'node-cron';
import { Subscription } from './subscriptions.model';

// Schedule a cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    await Subscription.updateMany(
      { endDate: { $lt: now }, status: 'active' },
      { $set: { status: 'inactive' } },
    );
    console.log('Subscription statuses updated successfully');
  } catch (error) {
    console.error('Error updating subscription statuses:', error);
  }
});
