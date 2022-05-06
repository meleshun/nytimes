const axios = require('axios').default;

const translate = async (text, to, from = 'en') => axios.get(`${process.env.TRANSLATE_URL}?text=${encodeURI(text)}&from=${from}&to=${to}`)
  .then((response) => response.data)
  .catch((e) => {
    e.name = 'Translateer';
    throw new Error(e);
  });

module.exports = translate;
