import Promise from 'bluebird';
import mongoose from 'mongoose';
import genericDao from '../utils/dao/generic-dao';

let GenericDao = genericDao('User', 'users');
let User = mongoose.model('User');

export default class UserDao extends GenericDao {

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
        
        return new Promise(function(resolve, reject) {
            user.save(function (err) {
                if (err) return reject(err);
                return resolve(user);
            });
        });
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

        return new Promise(function(resolve, reject) {
                User.findOneAndUpdate({ _id: id }, user, {'new': true}, function(err, user) {
                    if(err) return reject(err);
                    if(user === null) return reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": id,
                        "path": "_id"
                    });
                    return resolve(user);
                }); 
            });
    }

    hasOperation(method) {
        return new Promise((resolve, reject) => {
            User.findOne({ 'operations': method }, function(err, user) {
                if(user == null) return reject('No user Found'); 
            });
        });
    }

}