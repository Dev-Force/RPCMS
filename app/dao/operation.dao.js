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
    save(data) {
        if(data.namedParams) data.namedParams = data.namedParams.filter(Boolean);

        // If there there is a token, there must be a key value pair too
        if((data.tokenInHeaders || data.tokenInParams) && (!data.tokenValue || !data.tokenKey))
            return Promise.reject({
                errmsg: "If there is a token, there must be a key-value pair"
            });

        return super.save(data);
    }

    getByName(name) {
        return new Promise((resolve, reject) => {
            Operation.findOne({'name': name}, function(err, docs) {
                if(err) return reject(err);
                if(!docs) return reject('No Documents Found');
                return resolve(docs);
            })
        });
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
    updateById(id, data) {
        data.namedParams = data.namedParams.filter(Boolean);

        if((data.tokenInHeaders || data.tokenInParams) && (!data.tokenValue || !data.tokenKey))
            return Promise.reject({
                errmsg: "If there is a token, there must be a key-value pair"
            })

        return super.updateById(id, data);
    }

    batchInsert(data) {
        return new Promise((resolve, reject) => {
            Operation.collection.insert(data, (err, operations) => {
                if(err) reject(err); 
                resolve(operations);
            });
        });
    }

}

module.exports = OperationDao;