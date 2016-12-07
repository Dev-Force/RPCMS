import Promise from 'bluebird';
import mongoose from 'mongoose';
import genericDao from '../utils/dao/generic-dao';

let GenericDao = genericDao('Logs', 'logs', [
    'save',
    'getAll'
]);

let User = mongoose.model('Logs');

export default class LogsDao extends GenericDao { }