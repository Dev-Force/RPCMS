import Promise from 'bluebird';
import mongoose from 'mongoose';

/**
 * A function that takes 3 arguments and returns a Class to be used as a base for a dao Class
 * Available opts are <getAll, getById, save, updateById, deleteById, deleteMultiple>
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
        'getAll': function() {
            return new Promise(function(resolve, reject) {
                Generic.find({}, function(err, generics) {
                    if(err) return reject(err);
                    return resolve(generics);
                });
            });
        },
        'getById': function(id) {
            return new Promise(function(resolve, reject) {
                Generic.findOne({ _id: id }, function(err, Generic) {
                    if(err) return reject(err);
                    if(Generic === null) return reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": id,
                        "path": "_id"
                    });
                    return resolve(Generic);
                });
            });
        },
        'save': function(data) {
            let g = new Generic(data);

            return new Promise(function(resolve, reject) {
                g.save(function(err) {
                    if (err) reject(err);
                    return resolve(g);
                });
            });
        },
        'updateById': function(id, data) {
            return new Promise(function(resolve, reject) {
                Generic.findOneAndUpdate({ _id: id }, data, {'new': true}, function(err, Generic) {
                    if(err) return reject(err);
                    if(Generic === null) return reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": id,
                        "path": "_id"
                    });
                    return resolve(Generic);
                }); 
            });
        },
        'deleteById': function(id) {
            return new Promise(function(resolve, reject) {
                Generic.findByIdAndRemove(id, function(err, Generic) {
                    if(err) return reject(err);
                    if(Generic === null) return reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": id,
                        "path": "_id"
                    });
                    return resolve(Generic);
                });
            });
        },
        'deleteMultiple': function(idArray) {
            return new Promise(function(resolve, reject) {
                Generic.remove({
                    '_id': { $in: idArray }
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


