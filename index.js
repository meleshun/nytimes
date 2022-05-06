require('dotenv').config();
const cron = require('node-cron');
const logger = require('./components/utils/logger');
const telegram = require('./scripts/telegram');

cron.schedule('*/5 * * * *', () => {
  telegram().catch((e) => {
    logger.error(e);
  });
});
