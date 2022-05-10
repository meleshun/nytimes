const axios = require('axios').default;
const { schema: articleDTO } = require('../articles/article');
const { render } = require('../utils/template');

const publish = async (article) => {
  await articleDTO.validateAsync(article);

  return axios
    .post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, {
      chat_id: process.env.CHANNEL_NAME,
      photo: article.image,
      caption: await render('telegram', {
        title: article.title,
        description: (article.title ? article.description.slice(0, 2) : article.description).join('\n\n'),
        more: {
          text: process.env.BUTTON_MORE_TEXT,
          link: article.url,
        },
        subscribe: {
          text: `🇺🇦 ${process.env.TELEGRAPH_AUTHOR_NAME}`,
          link: process.env.TELEGRAPH_AUTHOR_URL,
        },
      }),
      parse_mode: 'HTML',
    })
    .catch((e) => {
      e.name = 'Telegram';
      throw new Error(e);
    });
};

module.exports = {
  publish,
};
