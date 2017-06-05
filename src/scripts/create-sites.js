import _ from 'lodash';
import SiteController from 'src/controllers/site-controller';

export default {
  run: async (sequelize) => {
    let sites = require('data/site-list.json');
    await SiteController.dropAll(sequelize);
    _.forEach(sites.sites, site => {
      SiteController.create(sequelize, {name: site, url: site});
    });
  }
};
