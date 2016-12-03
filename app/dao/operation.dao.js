import Promise from 'bluebird';
import mongoose from 'mongoose';
import genericDao from '../utils/dao/generic-dao';
import OperationController from '../controllers/api/operation.controller';

let GenericDao = genericDao('Operation', 'operations');
let Operation = mongoose.model('Operation');

export default class OperationDao extends GenericDao {

    getById(id, decoded_info) {
        if(decoded_info != null)
            return this.getAuthorizedCRUD(decoded_info).then(ops => {
                if(!ops.some(op => op._id.equals(id)))
                    return Promise.reject({ "errmsg": "Not Authorized to View this Operation" });

                return super.getById(id);
            });
        else return super.getById(id);
    }

    getAuthorizedCRUD(decoded_info) {
        return new Promise((resolve, reject) => {
            Operation.find({
                "owner": decoded_info.user_id 
            }, function(err, ops) {
                if(err) return reject(err);
                return resolve(ops);
            });
        });
    }

    getAll(decoded_info) {
        if(decoded_info != null) 
            return new Promise(function(resolve, reject) {
                Operation.find({
                    $or:[{
                        "_id": {
                                $in: decoded_info.operations
                            }
                        },
                        { "owner": decoded_info.user_id }
                    ]
                }, function(err, op) {
                    if(err) return reject(err);
                    return resolve(op);
                });
            });
        else return super.getAll();
    }

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
    save(data, decoded_info) {
        if(decoded_info != null) data.owner = mongoose.Types.ObjectId(decoded_info.user_id);

        if("namedParams" in data) data.namedParams = data.namedParams.filter(Boolean);

        // Check for duplicate Case Insensitive 
        let temp = {};
        data.namedParams = data.namedParams.filter(function(value, index, arr) {
            if(value.toUpperCase() in temp) return false;
            temp[value.toUpperCase()] = true;
            return value;
        })

        // If there there is a token, there must be a key value pair too
        if((data.tokenInHeaders || data.tokenInParams) && (!data.tokenValue || !data.tokenKey))
            return Promise.reject({
                errmsg: "If there is a token, there must be a key-value pair"
            });

        return super.save(data);
    }

    // Used By JsonRPCRequest
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
    updateById(id, data, decoded_info) {
        data.namedParams = data.namedParams.filter(Boolean);

        // Check for duplicate Case Insensitive 
        let temp = {};
        data.namedParams = data.namedParams.filter(function(value, index, arr) {
            if(value.toUpperCase() in temp) return false;
            temp[value.toUpperCase()] = true;
            return value;
        });

        if((data.tokenInHeaders || data.tokenInParams) && (!data.tokenValue || !data.tokenKey))
            return Promise.reject({
                errmsg: "If there is a token, there must be a key-value pair"
            });
        
        if(decoded_info != null) 
            return this.getAuthorizedCRUD(decoded_info).then(ops => {
                if(
                    ops != null
                    &&
                    !ops.some(op => op._id.equals(id))
                ) return Promise.reject({ "errmsg": "Not Authorized to Edit this Operation"});
                return super.updateById(id, data);
            });
        else return super.updateById(id, data);
    }

    deleteById(id, decoded_info) {
        if(decoded_info != null)
            return this.getAuthorizedCRUD(decoded_info).then(ops => {
                if(!ops.some(op => op._id.equals(id))) 
                    return Promise.reject({ "errmsg": "Not Authorized to Delete this Operation" });
                return super.deleteById(id);
            })
        else return super.deleteById(id);
    }

    deleteMultiple(idArray, decoded_info) {
        let idStringArray = idArray.map(op_id => op_id.toString());
        
        if(decoded_info != null) {
            return this.getAuthorizedCRUD(decoded_info).then(ops => {
                if(!ops.map(op => op._id.toString()).every(op_id => idStringArray.indexOf(op_id) > -1))
                    return Promise.reject({ "errmsg": "Not Authorized to Delete One of Those Operations" });
                return super.deleteMultiple(idArray);
            })
        } else return super.deleteMultiple(idArray);
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
