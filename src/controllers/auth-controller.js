import Users from 'src/schema/Users';
import Database from 'src/utils/database';
import jwt from 'jsonwebtoken';
import secret from 'src/constants/secret';
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

    createToken(user) {
      return jwt.sign(user, secret['secret'], {
        expiresIn: 1440*60 //24 hours
      });
    }

    verifyToken(token) {
      return new Promise((resolve, reject) => {
          jwt.verify(token, secret['secret'], (err, decoded) => {
            if(err)
              reject(err);
            else
              resolve(decoded);
          });
      });
    }

    getTokenErrorMessage() {
        return {
            success: false,
            message: 'Invalid Token'
        };
    }
}

export default new AuthController();
