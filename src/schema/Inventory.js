import Sequelize from 'sequelize';
export default (sequelize) => {
  return sequelize.define('inventory', {
    fileName: {
      type: Sequelize.STRING,
      field: 'file_name'
    },
    date: Sequelize.DATE
  });
};
