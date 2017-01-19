import Promise from 'bluebird';
import CRUDControllerGenerator from '~/utils/controller/crud-controller-generator';
import IPBlacklistDao from '~/dao/ip-blacklist.dao';

let CRUDController = CRUDControllerGenerator("_ipBlacklistDao", new IPBlacklistDao());

/**
 * 
 * 
 * @class IPBLacklistController
 */
export default class IPBlacklistController extends CRUDController { }
