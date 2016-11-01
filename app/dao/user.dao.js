import Promise from 'bluebird';
import mongoose from 'mongoose';
import genericDao from '../utils/dao/generic-dao';

let GenericDao = genericDao('User', 'users');
let User = mongoose.model('User');

class UserDao extends GenericDao {

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

        return super.updateById(id, data); 
    }

    hasOperation(method) {
        return new Promise((resolve, reject) => {
            User.findOne({ 'operations': method }, function(err, user) {
                if(user == null) return reject('No user Found'); 
            });
        });
    }

}

module.exports = UserDao;