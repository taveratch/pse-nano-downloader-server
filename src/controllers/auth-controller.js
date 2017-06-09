import Users from 'src/schema/Users';
import Database from 'src/utils/database';

export default {
  signin : async (username, password) => {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      Users(sequelize).sync()
      .then(() => {
        Users(sequelize).findOne({ where: {username: username} })
        .then(user => {
          console.log(user);
        });
      })
      .catch(err => {
        console.error('Error');
        resolve(err);
      });
    });
  },

  signup: async (username, password, site_id, admin) => {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      Users(sequelize).sync()
      .then(() => {
        Users(sequelize).create({
          username, password, site_id, admin
        });
      })
      .then(user => {
        console.log('Create user successfully');
        console.log(user);
      })
      .catch(err => {
        console.error(err);
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
