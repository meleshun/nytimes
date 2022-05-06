const { resolve } = require('path');
const { createLogger, format, transports } = require('winston');
const TelegramLogger = require('winston-telegram');

const logger = createLogger({
  // format: format.combine(format.timestamp(), format.json()),
  format: format.combine(
    format.timestamp(),
    format.printf(({
      level, message, timestamp,
    }) => `${timestamp} [${level}] ${message}`),
  ),
  transports: [
    new transports.File({
      level: 'error',
      filename: resolve(__dirname, '../../tmp/error.log'),
      handleExceptions: true,
    }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new TelegramLogger({
      level: 'error',
      token: process.env.BOT_TOKEN,
      chatId: process.env.CHAT_ID_LOGS,
      unique: true,
    }),
  );
} else {
  logger.add(
    new transports.Console({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      handleExceptions: true,
    }),
  );
}

module.exports = logger;
