const axios = require('axios').default;
const { schema: articleDTO } = require('../articles/article');

const publish = async (article) => {
  await articleDTO.validateAsync(article);

  const content = article.description.map((paragraph) => ({ tag: 'p', children: [paragraph] }));
  content.unshift({
    attrs: { src: article.image },
    tag: 'img',
  });

  return axios
    .post('https://api.telegra.ph/createPage', {
      access_token: process.env.TELEGRAPH_TOKEN,
      title: article.title,
      author_name: process.env.TELEGRAPH_AUTHOR_NAME,
      author_url: process.env.TELEGRAPH_AUTHOR_URL,
      content: JSON.stringify(content),
      return_content: true,
    })
    .then((res) => res.data.result)
    .catch((e) => {
      e.name = 'Telegraph';
      throw new Error(e);
    });
};

module.exports = {
  publish,
};
