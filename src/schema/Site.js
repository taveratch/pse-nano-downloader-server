import Sequelize from 'sequelize';

export default sequelize => {
  return sequelize.define('site', {
    name: Sequelize.STRING,
    url: Sequelize.STRING
  });
};
