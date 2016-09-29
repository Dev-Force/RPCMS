import mongoose from 'mongoose';

let Operation = mongoose.model('Operation');

module.exports = class OperationDao {

    store(req) {
        let op = new Operation(req.body);

        op.namedParams = op.namedParams.filter(Boolean);

        return new Promise(function(resolve, reject) {
            op.save(function(err) {
                if (err) reject(err);
                return resolve(op);
            });
        });
    }

    index() {
        return new Promise(function(resolve, reject) {
            Operation.find({}, function(err, operations) {
                if(err) return reject(err);
                return resolve(operations);
            });
        });
    }

    show(req) {
        return new Promise(function(resolve, reject) {
            Operation.findOne({ _id: req.params.id }, function(err, operation) {
                if(err) return reject(err);
                if(operation === null) return reject({
                    "message": "ObjectID was not found",
                    "name": "NotFoundError",
                    "kind": "ObjectId",
                    "value": req.params.id,
                    "path": "_id"
                });
                return resolve(operation);
            });
        });
    }

    update(req) {
        
        req.body.namedParams = req.body.namedParams.filter(Boolean);

        return new Promise(function(resolve, reject) {
            Operation.findOneAndUpdate({ _id: req.params.id }, req.body, {'new': true}, function(err, operation) {
                if(err) return reject(err);
                if(operation === null) return reject({
                    "message": "ObjectID was not found",
                    "name": "NotFoundError",
                    "kind": "ObjectId",
                    "value": req.params.id,
                    "path": "_id"
                });
                return resolve(operation);
            }); 
        });
    }

    destroy(req) {
        return new Promise(function(resolve, reject) {
            Operation.findByIdAndRemove(req.params.id, function(err, operation) {
                if(err) return reject(err);
                if(operation === null) return reject({
                    "message": "ObjectID was not found",
                    "name": "NotFoundError",
                    "kind": "ObjectId",
                    "value": req.params.id,
                    "path": "_id"
                });
                return resolve(operation);
            });
        });
    }

    destroyMass(req) {
        return new Promise(function(resolve, reject) {
            Operation.remove({
                '_id': { $in: req.body.operations.map(function(o){ return mongoose.Types.ObjectId(o); })}
            }, function(err, users) {
                if(err) return reject(err);
                return resolve(users);
            });
        });
    }

};
