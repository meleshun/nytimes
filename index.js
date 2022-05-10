const cron = require('node-cron');
const logger = require('./components/utils/logger');
const telegram = require('./scripts/telegram');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('dotenv').config();
}

if (process.env.NODE_ENV === 'production') {
  cron.schedule('*/5 * * * *', () => {
    telegram().catch((e) => {
      logger.error(e);
    });
  });
} else {
  telegram().catch((e) => {
    logger.error(e);
  });
}
