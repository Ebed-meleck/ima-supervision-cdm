import cron from 'node-cron';
import odkService from '../services/odkService.js';

// Schedule cron job to run at midnight and 5 AM daily
const scheduleODKSync = () => {
  // Run at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Starting scheduled ODK sync at midnight...');
    try {
      await odkService.downloadAndProcessAllForms();
      console.log('Scheduled ODK sync at midnight completed successfully');
    } catch (error) {
      console.error('Scheduled ODK sync at midnight failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Africa/Kinshasa" // Adjust timezone as needed
  });

  // Run at 5 AM (05:00)
  cron.schedule('0 5 * * *', async () => {
    console.log('Starting scheduled ODK sync at 5 AM...');
    try {
      await odkService.downloadAndProcessAllForms();
      console.log('Scheduled ODK sync at 5 AM completed successfully');
    } catch (error) {
      console.error('Scheduled ODK sync at 5 AM failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "Africa/Kinshasa" // Adjust timezone as needed
  });

  console.log('ODK sync cron jobs scheduled for midnight and 5 AM daily');
};

// Manual trigger function
const triggerManualSync = async () => {
  console.log('Manual ODK sync triggered...');
  try {
    await odkService.downloadAndProcessAllForms();
    console.log('Manual ODK sync completed successfully');
    return { success: true, message: 'Sync completed successfully' };
  } catch (error) {
    console.error('Manual ODK sync failed:', error);
    return { success: false, error: error.message };
  }
};

export { scheduleODKSync, triggerManualSync }; 