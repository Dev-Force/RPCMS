import mongoose from 'mongoose';

let User = mongoose.model('User');

module.exports = class UserDao {

    store = (req) => {
        let user = new User(req.body);
        user.password = user.generateHash(req.body.password);
        
        return new Promise(function(resolve, reject) {
            user.save(function (err) {
                if (err) return reject(err);
                return resolve(user);
            });
        });
    }

    index = () => {
        return new Promise(function(resolve, reject) {
            User.find({}, function(err, users) {
                if(err) return reject(err);
                return resolve(users);
            });
        });
    }

    show = (req) => {
        return new Promise(function(resolve, reject) {
            User.findOne({ _id: req.params.id }, function(err, user) {
                if(err) return reject(err);
                return resolve(user);
            });
        });
    }

    update = (req) => {
        return new Promise(function(resolve, reject) {
            User.findOneAndUpdate({ _id: req.params.id }, req.body, {'new': true}, function(err, user) {// Dont know if it should be req.body._id or req.body.id. Depends on implementation
                if(err) return reject(err);
                return resolve(user);
            }); 
        }); 
    }

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

    destroyMass = (req) => {
        console.log(req.body);
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
