import Users from 'src/schema/Users';
import Database from 'src/utils/database';

export default {
  signin : async (username, password) => {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      Users(sequelize).sync()
      .then(() => {
        Users(sequelize).findOne({ where: {username: username, password: password} })
        .then(user => {
          resolve(user);
        });
      })
      .catch(err => {
        reject(err);
      });
    });
  },

  signup: async (args) => { // username, password, site_id, admin
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      Users(sequelize).sync()
      .then(() => {
        Users(sequelize).create(args)
        .then(user => {
          resolve(user);
        })
        .catch(err => {
          reject(err);
        });
      });

    });
  },

  dropAll: async () => {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      Users(sequelize).drop()
      .then(() => { resolve(200);})
      .catch((err) => { reject(err);} );
    });
  }
};
