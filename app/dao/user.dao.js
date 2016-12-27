import Promise from 'bluebird';
import mongoose from 'mongoose';
import CRUDDaoGenerator from '../utils/dao/crud-dao-generator';

mongoose.Promise = Promise;

let CRUDDao = CRUDDaoGenerator(mongoose.model('User'));
let User = mongoose.model('User');

export default class UserDao extends CRUDDao {

    getAll() {
        return super.getAll().then(result => {
            return result.map(doc => {
                doc['password'] = undefined;
                return doc;
            });
        });
    }

    /**
     * Stores a User
     * 
     * @override
     * 
     * @param {Express.Request} req
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    save(data) {
        if(data.operations == null) data.operations = [];
        data.operations = data.operations.map(o => mongoose.Types.ObjectId(o));
        
        let user = new User(data);
        user.password = user.generateHash(data.password);

        return user.save();
    }

    /**
     * Updates a User
     * 
     * @override
     * 
     * @param {Express.Request} req
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    updateById(id, data) {
        if(data.operations == null) data.operations = [];
        data.operations = data.operations.map(o => mongoose.Types.ObjectId(o));

        let user = new User(data);
        if('password' in data && data.password !== "") user.password = user.generateHash(data.password);
        else user.password = undefined; // Possible bug here

        return User.findOneAndUpdate({ _id: id }, user, {'new': true}).exec().then(user => {
            if(user === null) return Promise.reject({
                    "message": "ObjectID was not found",
                    "name": "NotFoundError",
                    "kind": "ObjectId",
                    "value": id,
                    "path": "_id"
                });
            return user;
        })
    }

    hasOperation(method) {
        return User.findOne({ 'operations': method}).exec().then(user => {
            if(user === null) return Promise.reject('No User Found');
            return user;
        });
    }

}