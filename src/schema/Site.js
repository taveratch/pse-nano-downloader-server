import Sequelize from 'sequelize';

export default sequelize => {
  return sequelize.define('sites', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    url: Sequelize.STRING
  });
};
