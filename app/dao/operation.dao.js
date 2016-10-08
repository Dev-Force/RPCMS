import Promise from 'bluebird';
import mongoose from 'mongoose';
import genericDao from '../utils/dao/generic-dao';

let GenericDao = genericDao('Operation', 'operations');
let Operation = mongoose.model('Operation');

class OperationDao extends GenericDao {

    /**
     * Stores an Operation
     * 
     * @override
     * 
     * @param {Express.Request} req
     * 
     * @memberOf OperationDao
     * 
     * @returns {Promise} 
     */
    store(req) {
        req.body.namedParams = req.body.namedParams.filter(Boolean);
        return super.store(req);
    }

    /**
     * Updates an Operation
     * 
     * @override
     * 
     * @param {Express.Request} req
     * 
     * @memberOf OperationDao
     * 
     * @returns {Promise} 
     */
    update(req) {
        
        req.body.namedParams = req.body.namedParams.filter(Boolean);

        return super.update(req);
    }

    batchInsert(req) {
        return new Promise((resolve, reject) => {
            Operation.collection.insert(req.body, (err, operations) => {
                if(err) reject(err); 
                resolve(operations);
            });
        });
    }

}

module.exports = OperationDao;