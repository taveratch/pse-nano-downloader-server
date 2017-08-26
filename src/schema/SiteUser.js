import Sequelize from 'sequelize';

export default sequelize => {
  return sequelize.define('usersite', {
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    site_id: {
      type: Sequelize.INTEGER,
      references: 'sites',
      referencesKey: 'id'
    }
  });
};
