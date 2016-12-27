import Promise from 'bluebird';
import mongoose from 'mongoose';
import CRUDDaoGenerator from '~/utils/dao/crud-dao-generator';
import UserDao from './user.dao';
import OperationController from '~/controllers/api/operation.controller';

mongoose.Promise = Promise;

let Operation = mongoose.model('Operation');

let CRUDDao = CRUDDaoGenerator(mongoose.model('Operation'));

export default class OperationDao extends CRUDDao {

    _userDao;

    constructor() {
        super();
        this._userDao = new UserDao();
    }

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
        return Operation.find({
                "owner": decoded_info.user_id 
            }).exec();
    }

    getAll(decoded_info) {
        if(decoded_info != null)
            return Operation.find({
                    $or:[{
                        "_id": {
                                $in: decoded_info.operations
                            }
                        },
                        { "owner": decoded_info.user_id }
                    ]
                }).exec();
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

        let retrievedOpId = null;

        return super.save(data).then(op => {
            retrievedOpId = op._id;
            return this._userDao.getById(decoded_info.user_id);
        }).then(user => {
            user.operations.push(mongoose.Types.ObjectId(retrievedOpId));
            user.password = undefined;
            return this._userDao.updateById(user._id, user); // Possible bug here
        });
    }

    // Used By JsonRPCRequest
    getByName(name) {
        return Operation.findOne({'name': name}).exec().then(op => {
            if(!op) return Promise.reject('No Documents Found');
            return op;
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

    _deleteByIdHelper(id, decoded_info) {
        let retrievedOpId = null;

        return super.deleteById(id).then(op => {
            retrievedOpId = op._id;
            return this._userDao.getById(decoded_info.user_id);
        }).then(user => {
            user.operations.splice(user.operations.indexOf(mongoose.Types.ObjectId(retrievedOpId)), 1);
            user.password = undefined;
            return this._userDao.updateById(user._id, user);
        });
    }

    deleteById(id, decoded_info) {
        if(decoded_info != null)
            return this.getAuthorizedCRUD(decoded_info).then(ops => {
                if(!ops.some(op => op._id.equals(id))) 
                    return Promise.reject({ "errmsg": "Not Authorized to Delete this Operation" });
                return this._deleteByIdHelper(id, decoded_info);
            });
        else return this._deleteByIdHelper(id, decoded_info);
    }

    _deleteMultipleHelper(idArray, decoded_info) {
        return super.deleteMultiple(idArray).then(
            ops => this._userDao.getById(decoded_info.user_id)
        ).then(user => {
            idArray.forEach(id => {
                user.operations.splice(user.operations.indexOf(mongoose.Types.ObjectId(id)), 1);
            });
            user.password = undefined;
            return this._userDao.updateById(user._id, user);
        });
    }

    deleteMultiple(idArray, decoded_info) {
        let idStringArray = idArray.map(op_id => op_id.toString());
        
        if(decoded_info != null) {
            return this.getAuthorizedCRUD(decoded_info).then(ops => {
                if(
                    !idStringArray.every(id => 
                        ops.map(op => 
                            op._id.toString()
                        ).indexOf(id) > -1
                    )
                ) return Promise.reject({ "errmsg": "Not Authorized to Delete One of Those Operations" });
                return this._deleteMultipleHelper(idArray, decoded_info);
            })
        } else return this._deleteMultipleHelper(idArray, decoded_info);
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
