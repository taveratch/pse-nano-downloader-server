import SiteController from 'src/controllers/site-controller';
import InventoryDownloader from 'src/utils/inventory-downloader';

class DownloadService {
  async run() {
    let sites = await SiteController.getAll();
    for(let site of sites) {
      let inventoryList = await InventoryDownloader.getInventoryList(site.url);
      for(let inventory of inventoryList) {
        await InventoryDownloader.downloadAndSave(site, inventory);
      }
    }
  }
}

export default new DownloadService();
