const articleDTO = require('./articleDTO');
const translate = require('../utils/translate');

// const optimize = (() => {
//   const delimiter = {
//     title: '⌈',
//     description: '⌉',
//   };

//   return {
//     concat: (article) => {
//       const title = article.title ? article.title + delimiter.title : '';
//       const description = article.description
//         .map((paragraph) => paragraph.trim()).join(delimiter.description);

//       return title + description;
//     },
//     deconcat: (tmp) => {
//       tmp = tmp.split(delimiter.title);

//       const title = tmp[1] ? tmp[0] : undefined;
//       const description = tmp[1] ?? tmp[0];

//       return {
//         title,
//         description: description.split(delimiter.description),
//       };
//     },
//   };
// })();

const articleTranslate = async (article) => {
  await articleDTO.validateAsync(article);

  //   const { result } = await translate(optimize.concat(article), process.env.TRANSLATE_TO);

  if (article.title) {
    article.title = (await translate(article.title, process.env.TRANSLATE_TO)).result;
  }

  const description = [];
  for (let i = 0; i < article.description.length; i++) {
    description[i] = (await translate(article.description[i], process.env.TRANSLATE_TO)).result;
  }

  return {
    ...article,
    description,
  };
};

module.exports = articleTranslate;
