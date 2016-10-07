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
    store(req) {
        if(req.body.operations == null) req.body.operations = [];
        req.body.operations = req.body.operations.map(o => mongoose.Types.ObjectId(o));
        
        let user = new User(req.body);
        user.password = user.generateHash(req.body.password);
        
        return new Promise(function(resolve, reject) {
            user.save(function (err) {
                console.log(err);
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
    update(req) {
        if(req.body.operations == null) req.body.operations = [];
        req.body.operations = req.body.operations.map(o => mongoose.Types.ObjectId(o));

        return super.update(req); 
    }

}

module.exports = UserDao;