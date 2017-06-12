import Users from 'src/schema/Users';
import Database from 'src/utils/database';
class AuthController {
    constructor() {}

    async signin(username, password) {
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
    }

    async isExist(username) {
      let sequelize = await Database.start();
      return new Promise((resolve, reject) => {
        Users(sequelize).sync()
        .then(() => {
          Users(sequelize).findOne({ where: {username: username} })
          .then(user => {
            resolve(user);
          })
          .catch(err => {
            reject(err);
          });
        });
      });
    }

    async signup(args) {
      let sequelize = await Database.start();
      let isExist = await this.isExist(args['username']);
      return new Promise((resolve, reject) => {
        if(isExist) { reject('Username is already taken');}
        else {
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
        }
      });
    }

    async dropAll() {
      let sequelize = await Database.start();
      return new Promise((resolve, reject) => {
        Users(sequelize).drop()
        .then(() => { resolve(200);})
        .catch((err) => { reject(err);} );
      });
    }
}

export default new AuthController();

// export default {
//   signin: async (username, password) => {
//     let sequelize = await Database.start();
//     return new Promise((resolve, reject) => {
//       Users(sequelize).sync()
//       .then(() => {
//         Users(sequelize).findOne({ where: {username: username, password: password} })
//         .then(user => {
//           resolve(user);
//         });
//       })
//       .catch(err => {
//         reject(err);
//       });
//     });
//   },
//
//   isExist: async username => {
//     let sequelize = await Database.start();
//     return new Promise((resolve, reject) => {
//       Users(sequelize).sync()
//       .then(() => {
//         Users(sequelize).findOne({ where: {username: username} })
//         .then(user => {
//           resolve(user);
//         })
//         .catch(err => {
//           reject(err);
//         });
//       });
//     });
//   },
//
//   signup: async (args) => { // username, password, site_id, admin
//     let sequelize = await Database.start();
//     let isExist = await this.isExist(args['username']);
//     return new Promise((resolve, reject) => {
//       if(isExist) { reject('Username is already taken');}
//       else {
//         Users(sequelize).sync()
//         .then(() => {
//           Users(sequelize).create(args)
//           .then(user => {
//             resolve(user);
//           })
//           .catch(err => {
//             reject(err);
//           });
//         });
//       }
//     });
//   },
//
//   dropAll: async () => {
//     let sequelize = await Database.start();
//     return new Promise((resolve, reject) => {
//       Users(sequelize).drop()
//       .then(() => { resolve(200);})
//       .catch((err) => { reject(err);} );
//     });
//   }
// };
