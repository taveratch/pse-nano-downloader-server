import Sequelize from 'sequelize';
import {USERNAME, PASSWORD, DB_NAME, HOST, PORT} from 'src/constants/db-config';
export default {
  start: () => {
    const sequelize = new Sequelize(`mysql://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`);
    return new Promise((resolve, reject) => {
      sequelize.authenticate()
      .then(() => {
        console.log('Connection has been established');
        resolve(sequelize);
      })
      .catch((err) => {
        console.error('Unable to establish the connection', err);
        reject(err);
      });
    });
  }
};
