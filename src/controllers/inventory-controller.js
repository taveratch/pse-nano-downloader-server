import Database from 'src/utils/database';
import Inventory from 'src/schema/Inventory';

class InventoryController {

  async isExist(fileName) {
    let sequelize = await Database.start();
    return new Promise((resolve, reject) => {
        Inventory(sequelize).sync()
        .then(() => {
          Inventory(sequelize).findOne({ where: { file_name: fileName }})
          .then(inventory => {
            resolve(inventory);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async create(args) { // site_id, fileName, date
    let sequelize = await Database.start();
    let isExist = await this.isExist(args.fileName) !== null;
    return new Promise((resolve, reject) => {
      if(isExist) return;
      Inventory(sequelize).sync()
      .then(() => {
        Inventory(sequelize).create(args)
        .then(inventory => {
          resolve(inventory);
        })
        .catch(err => {
          reject(err);
        });
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  async dropAll() {
    let sequelize = await Database.start();
    return Inventory(sequelize).drop();
  }
}

export default new InventoryController();
