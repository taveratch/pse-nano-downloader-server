import Sequelize from 'sequelize';

export default sequelize => {
  return sequelize.define('site', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: Sequelize.STRING,
    url: Sequelize.STRING
  });
};
