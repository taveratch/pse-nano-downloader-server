import express from 'express';
import cors from 'cors';
import database from './utils/database';
let app = express();
import CreateSite from 'src/scripts/create-sites';
import AuthController from 'src/controllers/auth-controller';
import Migrate from 'src/scripts/migrate';
app.use(cors());

(async () => {
  // inventoryDownloader.download();
  let sequelize = await database.start();
  // CreateSite.run(sequelize);
  // AuthController();
  AuthController.signup('taweesoft', '123456', 100, false );
  // AuthController.signin('taweesoft', '12345s6');
  // Migrate.run();
})();
