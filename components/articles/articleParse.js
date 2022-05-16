const axios = require('axios').default;
const { parse } = require('node-html-parser');
const { get: lastDate } = require('../utils/date');

const getLink = () => `https://www.nytimes.com/live/${new Date().toLocaleDateString('en-ZA')}/world/russia-ukraine-war-news`;

const getJson = (HTMLElement) => {
  const elements = HTMLElement.querySelectorAll('script[type="application/ld+json"]');
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const json = JSON.parse(element.text);
    if (json.liveBlogUpdate) {
      return json.liveBlogUpdate;
    }
  }
  return undefined;
};

const parseArticles = async (HTMLElement) => {
  const json = getJson(HTMLElement);

  if (!json) {
    throw new Error('liveBlogUpdate key not found');
  }

  const discriptions = HTMLElement.querySelectorAll('[role="article"]').map((articleElement) => articleElement.querySelectorAll('p.evys1bk0').map((desc) => desc.text.replace(/\s+/g, ' ')));

  return json.map((article) => ({
    title: article.headline.length !== 110 ? article.headline : undefined,
    description: discriptions.find((desc) => article.articleBody.startsWith(desc[0]?.slice(0, 80))),
    image: article.image[0].url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
  })).filter((article) => article.description).slice(1).reverse();
};

const getArticles = async () => axios
  .get(getLink(), {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36',
    },
  })
  .then((response) => response.data)
  .then(parse)
  .then(parseArticles)
  .catch((e) => {
    e.name = 'NYTimes';
    throw new Error(e);
  });

const getUpdates = async () => getArticles()
  .then((articles) => articles.filter((article) => new Date(article.datePublished) > lastDate()));

module.exports = {
  getArticles,
  getUpdates,
};
