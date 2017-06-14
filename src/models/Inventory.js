import moment from 'moment';

class Inventory {
  constructor(fileName, date) {
    this.fileName = fileName;
    this.date = moment(date, 'YYYYMMDD');
  }
}

export default Inventory;
