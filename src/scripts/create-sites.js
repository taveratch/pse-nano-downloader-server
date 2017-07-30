import _ from 'lodash';
import SiteController from 'src/controllers/site-controller';

export default {
  run: async () => {
    let sites = require('data/site-list.json');
    _.forEach(sites.sites, site => {
      SiteController.create({name: site.name, url: site.url});
    });
  }
};
