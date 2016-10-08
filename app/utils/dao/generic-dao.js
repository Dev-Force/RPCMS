import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 * Available opts are <index, show, store, update, destroy, destroyMass>
 * 
 * @param {any} mdl
 * @param {any} mdl_plural
 * @param {any} [opts=[]]
 * @returns {Class}
 */
module.exports = function(mdl, mdl_plural, opts = []) {

    mdl_plural = mdl_plural.toLowerCase();

    let Generic = mongoose.model(mdl);

    let defaultParams = {
        'index': function() {
            return new Promise(function(resolve, reject) {
                Generic.find({}, function(err, generics) {
                    if(err) return reject(err);
                    return resolve(generics);
                });
            });
        },
        'show': function(req) {
            return new Promise(function(resolve, reject) {
                Generic.findOne({ _id: req.params.id }, function(err, Generic) {
                    if(err) return reject(err);
                    if(Generic === null) return reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": req.params.id,
                        "path": "_id"
                    });
                    return resolve(Generic);
                });
            });
        },
        'store': function(req) {
            let op = new Generic(req.body);

            return new Promise(function(resolve, reject) {
                op.save(function(err) {
                    if (err) reject(err);
                    return resolve(op);
                });
            });
        },
        'update': function(req) {
            return new Promise(function(resolve, reject) {
                Generic.findOneAndUpdate({ _id: req.params.id }, req.body, {'new': true}, function(err, Generic) {
                    if(err) return reject(err);
                    if(Generic === null) return reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": req.params.id,
                        "path": "_id"
                    });
                    return resolve(Generic);
                }); 
            });
        },
        'destroy': function(req) {
            return new Promise(function(resolve, reject) {
                Generic.findByIdAndRemove(req.params.id, function(err, Generic) {
                    if(err) return reject(err);
                    if(Generic === null) return reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": req.params.id,
                        "path": "_id"
                    });
                    return resolve(Generic);
                });
            });
        },
        'destroyMass': function(req) {
            return new Promise(function(resolve, reject) {
                Generic.remove({
                    '_id': { $in: req.body[mdl_plural].map(function(o){ return mongoose.Types.ObjectId(o); })}
                }, function(err, generics) {
                    if(err) return reject(err);
                    return resolve(generics);
                });
            });
        }
    };

    let params = {};
    // Combine defaultParams and opts into params
    if(opts.length > 0) {
        for(let param in defaultParams) { 
            if(opts.indexOf(param) > -1) {
                params[param] = defaultParams[param];
            }
        }
    } else {
        params = defaultParams;
    }
    
    class GenericDao { }

    for(let param in params) {
        GenericDao.prototype[param] = params[param];
    }

    return GenericDao;
};


