import Promise from 'bluebird';

/**
 * A function that takes 3 arguments and returns a Class to be used as a base for a dao Class
 * Available opts are <getAll, getById, save, updateById, deleteById, deleteMultiple>
 * 
 * @param {String} mdl
 * @param {String} mdl_plural
 * @param {String[]} [opts=[]]
 * @param {string} opts[].getAll - get all documents
 * @param {string} opts[].getById - get document based on id
 * @param {string} opts[].save - The employee's department.
 * @param {string} opts[].updateById - The employee's department.
 * @param {string} opts[].deleteById - The employee's department.
 * @param {string} opts[].deleteMultiple - The employee's department.
 * @returns {Class}
 */
export default function(Generic, opts = []) {

    let defaultParams = {
        'getAll': function() {
            return Generic.find({}).exec();
        },
        'getById': function(id) {
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

            return g.save();
        },
        'updateById': function(id, data) {
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
            return Generic.remove({ '_id': { $in: idArray } }).exec();
        }
    };

    let params = {};

    // Combine defaultParams and opts into params
    if(opts.length > 0) {
        for (let param in defaultParams)
            if (opts.indexOf(param) > -1)
                params[param] = defaultParams[param];
    } else params = defaultParams;


    class GenericDao { }

    for(let param in params)
        GenericDao.prototype[param] = params[param];

    return GenericDao;
};


