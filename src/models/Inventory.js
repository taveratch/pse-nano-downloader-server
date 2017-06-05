import moment from 'moment';
import Sequelize from 'sequelize';

class Inventory extends Sequelize.Model{
 constructor(fileName, date) {
   super(fileName, moment(date, 'YYYYMMDD'));
 }
}

export default Inventory;
