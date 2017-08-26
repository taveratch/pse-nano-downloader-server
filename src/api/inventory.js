import express from 'express';
import AuthController from 'src/controllers/auth-controller';
import SiteUserController from 'src/controllers/site-user-controller';
import InventoryController from 'src/controllers/inventory-controller';
import DownloadService from 'src/services/download-service';
let inventoryAPI = express();

inventoryAPI.get('/', async (req, res) => {
  let token = req.get('authorization');
  let siteId = req.query.siteId;
  if(!token)
    return res.status(401).send(AuthController.getTokenErrorMessage());
  try {
    let user = await AuthController.verifyToken(token);
    let hasPermission = await SiteUserController.isExist(siteId, user.id);
    if(hasPermission) { /* Allowed to fetch the inventories */
      let inventories = await InventoryController.getBySiteId(siteId);
      res.status(200).send({
        success: true,
        inventories: inventories
      });
    }else { /* not allowed to fetch the inventories */
      res.status(401).send({
        success: false,
        message: 'Permission denied'
      });
    }
  }catch(error) {
    res.status(401).send(AuthController.getTokenErrorMessage());
  }
});

inventoryAPI.get('/fetch', (req, res) => {
  DownloadService.run();
});

export default inventoryAPI;
