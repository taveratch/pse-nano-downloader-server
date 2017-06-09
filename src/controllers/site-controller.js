import Site from 'src/schema/Site';
import Database from 'src/utils/database';

export default {
  create: (sequelize, args) => {
    return new Promise((resolve, reject) => {
      Site(sequelize).sync()
      .then(() => {
        Site(sequelize).create(args);
      })
      .then(site => {
        resolve(site);
      })
      .catch(err => {
        reject(err);
      });
    });
  },
  get: async id => {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      Site(sequelize).findOne({
        where: {id: id}
      })
      .then(site => {
        resolve(site);
      })
      .catch(err => {
        reject(err);
      });
    });
  },
  dropAll: (sequelize) => {
    return new Promise((resolve, reject) => {
      Site(sequelize).drop()
      .then(() => resolve(200))
      .catch(err => reject(err));
    });
  }
};
