import Sequelize from 'sequelize';

export default sequelize => {
  return sequelize.define('users', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    admin: Sequelize.BOOLEAN,
  });
};
