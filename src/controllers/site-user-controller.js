import SiteUser from 'src/schema/SiteUser.js';
import Database from 'src/utils/database';

class SiteUserController {
  async create (siteId, userId) {
    let isExist = await this.isExist(siteId, userId);
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      if(isExist){
        reject('User has already belong to this site');
        return;
      }
      SiteUser(sequelize).sync()
      .then(() => {
        SiteUser(sequelize).create({
          site_id: siteId,
          user_id: userId
        })
        .then(siteUser => {
          resolve(siteUser);
        })
        .catch(err => {
          reject(err);
        });
      });
    });
  }

  async isExist(siteId, userId) {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      SiteUser(sequelize).sync()
      .then(() => {
        SiteUser(sequelize).findOne({
          where: {
            site_id: siteId,
            user_id: userId
          }
        })
        .then(siteuser => {
          resolve(siteuser);
        })
        .catch(err => {
          reject(err);
        });
      });
    });
  }

  async getByUserId(userId) {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
      SiteUser(sequelize).sync()
      .then(() => {
        SiteUser(sequelize).findAll({
          where: {
            user_id: userId
          }
        })
        .then(siteusers => {
          resolve(siteusers);
        })
        .catch(err => {
          reject(err);
        });
      });
    });
  }
}

export default new SiteUserController();
