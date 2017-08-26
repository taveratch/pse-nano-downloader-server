import Sequelize from 'sequelize';
export default (sequelize) => {
  return sequelize.define('inventory', {
    site_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'sites',
        key: 'id'
      }
    },
    fileName: {
      type: Sequelize.STRING,
      field: 'file_name'
    },
    date: Sequelize.DATE
  });
};
