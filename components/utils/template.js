const { promises: fs } = require('fs');
const { resolve } = require('path');
const Mustache = require('mustache');

const render = async (template, view) => {
  template = await fs.readFile(resolve(__dirname, `../../templates/${template}.mustache`), 'utf-8');
  return Mustache.render(template, view);
};

module.exports = {
  render,
};
