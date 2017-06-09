import Database from 'src/utils/database';
import Site from 'src/schema/Site';
import Users from 'src/schema/Users';
import Inventory from 'src/schema/Inventory';
import AuthController from 'src/controllers/auth-controller';
import SiteController from 'src/controllers/site-controller';

export default {
  run: async () => {
    let sequelize = await Database.start();
    AuthController.dropAll(sequelize);
    SiteController.dropAll(sequelize);
    let UsersSchema = Users(sequelize);
    let SiteSchema = Site(sequelize);
    UsersSchema.hasOne(SiteSchema);
    sequelize.sync({ force: true});
  }
};
