import request from 'request';
import _ from 'lodash';
import jsonLoader from './utils/json-loader';
import Inventory from 'src/models/Inventory';
import Site from 'src/models/Site';

export default {
  download: async () => {
    let sites = await jsonLoader('site-list');
    _.forEach(sites, (value) => {
      getInventoryList(value);
    });
  }
};

function getInventoryList(siteUrl) {
  const PORT = 7878;
  let url = `${siteUrl}:${PORT}/inventory/filesrecord.txt`;
  let options = {
    url : url,
    headers: {
      'Authorization' : 'Basic dXNlcjpwYXNz'
    }
  };

  request(options, (err, response, body) => {
    let files = formatResult(body);
    let site = new Site(siteUrl, files);
    console.log(site);
  });
}

function formatResult(res) {
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
