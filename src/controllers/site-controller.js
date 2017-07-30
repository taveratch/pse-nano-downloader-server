import Site from 'src/schema/Site';
import Database from 'src/utils/database';

export default {

  /*
    Create a site in database.
    @arg: {name: String, url: String}
  */
  create: async args => {
    let sequelize = await Database.start();
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

  /*
    Get site by id
  */
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

  /*
    Remove all sites in database.
  */
  dropAll: async () => {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      Site(sequelize).drop()
      .then(() => resolve(200))
      .catch(err => reject(err));
    });
  },

  /*
    Get all sites
  */
  getAll: async () => {
    let sequelize = await Database.start();
    return Site(sequelize).findAll();
  },

  getByUserId: async (userId) => {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      // Site(sequelize).findAll({
      //   where: {
      //     id
      //   }
      // })
    });
  }
};
