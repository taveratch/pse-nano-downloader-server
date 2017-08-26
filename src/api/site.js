import express from 'express';
import _ from 'lodash';
import SiteController from 'src/controllers/site-controller.js';
import AuthController from 'src/controllers/auth-controller.js';
import SiteUserController from 'src/controllers/site-user-controller.js';
import CreateSite from '../scripts/create-sites.js';

let siteAPI = express();

siteAPI.get('/removeall', (req, res) => {
  console.log('--------Dropping sites--------');
  SiteController.dropAll();
  res.send({
    success: true
  });
});

siteAPI.get('/create', (req, res) => {
  console.log('--------Creating sites--------');
  CreateSite.run();
  res.send({
    success: true
  });
});

siteAPI.post('/adduser', (req, res) => {
  console.log('--------Adding user to site---------');
  let userId = req.body.userId;
  let siteId = req.body.siteId;
  if(!userId || !siteId){
    res.status(400).send({
      success: false,
      message: 'Parameter is missing'
    });
    return;
  }
  SiteUserController.create(siteId, userId)
  .then(() => {
    res.status(200).send({
      success: true
    });
  })
  .catch(err => {
    res.status(404).send({
      success: false,
      message: err
    });
  });
});

siteAPI.get('/', async (req, res) => {
  let token = req.get('authorization');
  if(!token)
    return res.status(401).send(AuthController.getTokenErrorMessage());
  try {
    let user = await AuthController.verifyToken(token);
    let userId = user.id;
    let siteUsers = await SiteUserController.getByUserId(userId);
    let ids = _.map(siteUsers, 'id');
    let sites = await SiteController.getByIds(ids);
    res.status(200).send({
      success: true,
      sites: sites
    });
  }catch(err) {
    res.status(401).send(AuthController.getTokenErrorMessage());
  }
});

export default siteAPI;
