import Sequelize from 'sequelize';

import {USERNAME, PASSWORD, DB_NAME, HOST, PORT} from 'src/constants/db-config';

let sequelize = null;
export default {
  start: () => {
    if(sequelize) return new Promise((resolve, reject) => { resolve(sequelize); });
    const seq = new Sequelize(`mysql://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}`);
    return new Promise((resolve, reject) => {
      seq.authenticate()
      .then(() => {
        sequelize = seq;
        resolve(seq);
      })
      .catch((err) => {
        console.error('Unable to establish the connection', err);
        reject(err);
      });
    });
  }
};
