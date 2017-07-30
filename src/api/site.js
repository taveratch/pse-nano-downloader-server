import express from 'express';
import SiteController from 'src/controllers/site-controller.js';
import AuthController from 'src/controllers/auth-controller.js';
import SiteUserController from 'src/controllers/site-user-controller.js';
import CreateSite from '../scripts/create-sites.js';

let siteAPI = express();

siteAPI.get('/', (req, res) => {
  // let token = req.query.token;

});

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

siteAPI.get('/get', async (req, res) => {
  let token = req.get('authorization');
  try {
    let user = await AuthController.verifyToken(token);
    let userId = user.id;
    let siteUsers = await SiteUserController.getByUserId(userId);
    res.status(200).send({
      success: true,
      sites: siteUsers
    });
  }catch(err) {
    res.status(401).send({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default siteAPI;
