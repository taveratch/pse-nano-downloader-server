const PATH = 'data';

export default async (fileName) => {
  let json = require(`${PATH}/${fileName}.json`);
  return json;
};
