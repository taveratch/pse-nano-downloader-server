import request from 'request';
import _ from 'lodash';
import jsonLoader from './json-loader';
import Inventory from 'src/models/Inventory';
import writeFile from 'write';
import InventoryController from 'src/controllers/inventory-controller';
const PORT = 7878;

class Downloader {

  async downloadAll() {
    let sites = await jsonLoader('site-list');
    _.forEach(sites, (value) => {
      this.getInventoryList(value);
    });
  }

  getInventoryList(siteUrl) {
    console.log('---- Get inventory list from ' + siteUrl + ' ----');
    let url = `${siteUrl}:${PORT}/inventory/filesrecord.txt`;
    let options = {
      url : url,
      headers: {
        'Authorization' : 'Basic dXNlcjpwYXNz'
      }
    };

    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if(err) return reject(err);
        console.log('---- (Success) Get inventory list from ' + siteUrl + ' ----');
        let files = this.formatResult(body);
        resolve(files);
      });
    });
  }

  downloadAndSave(site, inventory) {
    let url = `${site.url}:${7878}/inventory/${inventory.fileName}`;
    let options = {
      url: url,
      headers: {
        'Authorization': 'Basic dXNlcjpwYXNz'
      }
    };

    return new Promise((resolve, reject) => {
      let fileName = `files/${site.name}_${inventory.fileName}`;
      request(options, (err, response, body) => {
        if(err) throw err;
        writeFile(fileName, body, async (err) => {
          if(err) reject(err);
          console.log(`----Downloaded ${fileName}----`);
          let inventoryRes = await InventoryController.create({
            site_id: site.id,
            fileName: fileName,
            date: inventory.date
          });
          resolve(inventoryRes);
        });
      });
    });
  }

  formatResult(res) {
    let arr = res.split('\n'); // split into array of file location
    arr = _.drop(arr); // remove the first element `totalFiles[30]`
    arr = _.drop(arr); // remove the first element `index(29)`
    arr = _.dropRight(arr); // remove the extra last element ``
    _.forEach(arr, (each,i) => {
      let fileName = arr[i].substring(17); // get file name
      let date = fileName.substring(fileName.indexOf('_') + 1, fileName.indexOf('.csv')); // get date in YYYYMMDD
      arr[i] = new Inventory(fileName, date);
    });
    return arr;
  }

}

export default new Downloader();
