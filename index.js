require('dotenv').config();
const logger = require('./components/utils/logger');

const { parse, translate } = require('./components/articles/article');
const { publish: publishTelegraph } = require('./components/publishers/telegraph');
const { publish: publishTelegram } = require('./components/publishers/telegram');
const { set: saveDate } = require('./components/utils/date');

const run = async () => {
  const articles = await parse.getUpdates();

  for (let i = 0; i < articles.length; i++) {
    const article = await translate(articles[i]);

    if (article.title) {
      article.url = (await publishTelegraph(article)).url;
    }

    await publishTelegram(article);

    saveDate(new Date(article.datePublished));
  }
};

run().catch((e) => {
  logger.error(e);
});
