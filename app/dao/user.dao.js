import mongoose from 'mongoose';

let User = mongoose.model('User');

module.exports = class UserDao {

    /**
     * Stores a User
     * 
     * @param {Express.Request} req
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    store = (req) => {
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
     * Indexes All Users
     * 
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    index = () => {
        return new Promise(function(resolve, reject) {
            User.find({}, function(err, users) {
                if(err) return reject(err);
                return resolve(users);
            });
        });
    }

    /**
     * Shows a single User
     * 
     * @param {Express.Request} req
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    show = (req) => {
        return new Promise(function(resolve, reject) {
            User.findOne({ _id: req.params.id }, function(err, user) {
                if(err) return reject(err);
                return resolve(user);
            });
        });
    }

    /**
     * Updates a User
     * 
     * @param {Express.Request} req
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    update = (req) => {
        if(req.body.operations == null) req.body.operations = [];
        req.body.operations = req.body.operations.map(o => mongoose.Types.ObjectId(o));

        return new Promise(function(resolve, reject) {
            User.findOneAndUpdate({ _id: req.params.id }, req.body, {'new': true}, function(err, user) {// Dont know if it should be req.body._id or req.body.id. Depends on implementation
                if(err) return reject(err);
                return resolve(user);
            }); 
        }); 
    }

    /**
     * Deletes a User
     * 
     * @param {Express.Request} req
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    destroy = (req) => {
        return new Promise(function(resolve, reject) {
            User.findByIdAndRemove(req.params.id, function(err, result) {
                if(err) return reject(err);
                if(result == null) return reject({
                    "message": "ObjectID was not found",
                    "name": "NotFoundError",
                    "kind": "ObjectId",
                    "value": req.params.id,
                    "path": "_id"
                });
                return resolve(result);
            });
        });
    }

    /**
     * Deletes multiple Users
     * 
     * @param {Express.Request} req
     * 
     * @memberOf UserDao
     * 
     * @returns {Promise} 
     */
    destroyMass = (req) => {
        return new Promise(function(resolve, reject) {
            User.remove({
                '_id': { $in: req.body.users.map(function(o){ return mongoose.Types.ObjectId(o); })}
            }, function(err, users) {
                if(err) return reject(err);
                return resolve(users);
            });
        });
    }


};
