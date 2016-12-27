import Promise from 'bluebird';
import mongoose from 'mongoose';
import CRUDDaoGenerator from '~/utils/dao/crud-dao-generator';

let CRUDDao = CRUDDaoGenerator(mongoose.model("IPBlacklist"));

export default class IPBlacklistDao extends CRUDDao { }