// eslint-disable-next-line import/no-extraneous-dependencies, global-require
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const logger = require('./components/utils/logger');
const telegram = require('./scripts/telegram');

telegram().catch((e) => {
  logger.error(e);
});
