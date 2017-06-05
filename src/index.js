import express from 'express';
import cors from 'cors';
import database from './utils/database';
let app = express();
import CreateSite from 'src/scripts/create-sites';
app.use(cors());

(async () => {
  // inventoryDownloader.download();
  let sequelize = await database.start();
  CreateSite.run(sequelize);
})();
