import Promise from 'bluebird';
import mongoose from 'mongoose';
import CRUDDaoGenerator from '~/utils/dao/crud-dao-generator';

let CRUDDao = CRUDDaoGenerator(mongoose.model('Logs'), [
    'save',
    'getAll'
]);

export default class LogsDao extends CRUDDao { }