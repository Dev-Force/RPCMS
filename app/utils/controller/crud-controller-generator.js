import mongoose from 'mongoose';

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
export default function(property_name, dao_object, opts = []) {

    let defaultParams = {
        'store': function() {
            return (req, res) => {
                this[property_name].save(req.body).then(function(doc) {
                    res.json(doc);
                }).catch(this.catchFunction(res));
            };
        },
        'index': function() {
            return (req, res) => {
                this[property_name].getAll().then(function(docs) {
                    res.json(docs);
                }).catch(this.catchFunction(res));
            };
        },
        'show': function() {
            return (req, res) => {
                this[property_name].getById(req.params.id).then(function(doc) {
                    res.json(doc);
                }).catch(this.catchFunction(res));
            };
        },
        'update': function() {
            return (req, res) => {
                this[property_name].updateById(req.params.id, req.body).then(function(doc) {
                    res.json(doc);
                }).catch(this.catchFunction(res));
            };
        },
        'destroy': function() {
            return (req, res) => {
                this[property_name].deleteById(req.params.id).then(function(doc) {
                    res.json(doc);
                }).catch(this.catchFunction(res));
            };
        },
        'destroyMass': function() {
            return (req, res) => {
                let idArray = req.body.map(function(o){ return mongoose.Types.ObjectId(o); });

                this[property_name].deleteMultiple(idArray).then(function(docs) {
                    res.json(docs);
                }).catch(this.catchFunction(res));
            };
        }
    };

    let params = {};

    // Combine defaultParams and opts into params
    if(opts.length > 0) {
        for (let param in defaultParams)
            if (opts.indexOf(param) > -1)
                params[param] = defaultParams[param];
    } else params = defaultParams;


    class GenericController {

        catchFunction(res) {
            return function(err) {
                res.json(err);
            };
        }

    }

    GenericController.prototype[property_name] = dao_object;

    for(let param in params)
        GenericController.prototype[param] = params[param];

    return GenericController;
};


