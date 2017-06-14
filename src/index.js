import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import database from './utils/database';
import morgan from 'morgan';
import CreateSite from 'src/scripts/create-sites';
import AuthController from 'src/controllers/auth-controller';
import Migrate from 'src/scripts/migrate';
import authAPI from 'src/api/auth';
import DownloadService from 'src/services/download-service';
import InventoryController from 'src/controllers/inventory-controller';
import log4js from 'src/utils/log4js';

log4js();

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use(morgan('dev'));

(async () => {
  // inventoryDownloader.download();
  await database.start();
  app.use('/auth', authAPI);
  // InventoryController.dropAll();
  DownloadService.run();
  // Migrate.run();
  // CreateSite.run();
  // AuthController();
  // AuthController.signup('taweesoft', '123456', 100, false );
  // AuthController.signin('taweesoft', '12345s6');
})();

app.listen(3000);
