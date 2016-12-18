import Promise from 'bluebird';
import mongoose from 'mongoose';

mongoose.Promise = Promise;

/**
 * A function that takes 3 arguments and returns a Class to be used as a base for a dao Class
 * Available opts are <getAll, getById, save, updateById, deleteById, deleteMultiple>
 * 
 * @param {any} mdl
 * @param {any} mdl_plural
 * @param {any} [opts=[]]
 * @returns {Class}
 */
export default function(mdl, mdl_plural, opts = []) {

    mdl_plural = mdl_plural.toLowerCase();

    let Generic = mongoose.model(mdl);

    let defaultParams = {
        'getAll': function() {
            return Generic.find({}).exec();
            // return new Promise(function(resolve, reject) {
            //     Generic.find({}, function(err, generics) {
            //         if(err) return reject(err);
            //         return resolve(generics);
            //     });
            // });
        },
        'getById': function(id) {
            // return new Promise(function(resolve, reject) {
            //     Generic.findOne({ _id: id }, function(err, Generic) {
            //         if(err) return reject(err);
            //         if(Generic === null) return reject({
            //             "message": "ObjectID was not found",
            //             "name": "NotFoundError",
            //             "kind": "ObjectId",
            //             "value": id,
            //             "path": "_id"
            //         });
            //         return resolve(Generic);
            //     });
            // });
            return Generic.findOne({_id: id}).exec().then(generic => {
                if(generic === null) return Promise.reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": id,
                        "path": "_id"
                    });
                return generic;
            });
        },
        'save': function(data) {
            let g = new Generic(data);

            // return new Promise(function(resolve, reject) {
            //     g.save(function(err) {
            //         if (err) reject(err);
            //         return resolve(g);
            //     });
            // });
            return g.save();
        },
        'updateById': function(id, data) {
            // return new Promise(function(resolve, reject) {
            //     Generic.findOneAndUpdate({ _id: id }, data, {'new': true}, function(err, Generic) {
            //         if(err) return reject(err);
            //         if(Generic === null) return reject({
            //             "message": "ObjectID was not found",
            //             "name": "NotFoundError",
            //             "kind": "ObjectId",
            //             "value": id,
            //             "path": "_id"
            //         });
            //         return resolve(Generic);
            //     }); 
            // });
            return Generic.findOneAndUpdate({ _id: id }, data, {'new': true}).exec().then(generic => {
                if(generic === null) return Promise.reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": id,
                        "path": "_id"
                    });
                return generic;
            });
        },
        'deleteById': function(id) {
            // return new Promise(function(resolve, reject) {
            //     Generic.findByIdAndRemove(id, function(err, Generic) {
            //         if(err) return reject(err);
            //         if(Generic === null) return reject({
            //             "message": "ObjectID was not found",
            //             "name": "NotFoundError",
            //             "kind": "ObjectId",
            //             "value": id,
            //             "path": "_id"
            //         });
            //         return resolve(Generic);
            //     });
            // });
            return Generic.findByIdAndRemove(id).exec().then(generic => {
                if(generic === null) return Promise.reject({
                        "message": "ObjectID was not found",
                        "name": "NotFoundError",
                        "kind": "ObjectId",
                        "value": id,
                        "path": "_id"
                    });
                return generic;
            });
        },
        'deleteMultiple': function(idArray) {
            // return new Promise(function(resolve, reject) {
            //     Generic.remove({
            //         '_id': { $in: idArray }
            //     }, function(err, generics) {
            //         if(err) return reject(err);
            //         return resolve(generics);
            //     });
            // });
            return Generic.remove({ '_id': { $in: idArray } }).exec();
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


