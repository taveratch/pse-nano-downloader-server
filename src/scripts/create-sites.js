import _ from 'lodash';
import Database from 'src/utils/database';
import SiteController from 'src/controllers/site-controller';

export default {
  run: async () => {
    let sequelize = await Database.start();
    let sites = require('data/site-list.json');
    await SiteController.dropAll(sequelize);
    _.forEach(sites.sites, site => {
      SiteController.create({name: site.name, url: site.url});
    });
  }
};
