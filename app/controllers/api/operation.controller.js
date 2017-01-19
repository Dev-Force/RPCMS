import Promise from 'bluebird';
import mongoose from 'mongoose';
import OperationDao from '~/dao/operation.dao';
import jwt from 'jsonwebtoken';
import config from '#/config';
import needle from 'needle';

let Operation = mongoose.model('Operation');

/**
 * 
 * 
 * @class OperationController
 */
export default class OperationController {

    _operationDao;

    /**
     * Creates an instance of OperationController.
     * 
     * 
     * @memberOf OperationController
     */
    constructor() {
        this._operationDao = new OperationDao();
     }

    /**
     * Default callback for promise Failure
     * 
     * @returns
     * 
     * @memberOf OperationController
     * 
     * @returns {Function}
     */
    catchFunction(res) {
        return function(err) {
            console.log("ERROR: " + err.stack);
            res.json(err);
        };
    }

    /**
     * Stores an Operation
     *
     * 
     * @memberOf OperationController
     */
    store() {
        return (req, res) => {
            this._operationDao.save(req.body, req.decoded).then(function(operation) {
                //let token = req.decoded;
                //if(token != null) {
                //    token.operations.push(operation._id);
                //    jwt.sign()
                //}
                //console.log(token);
                res.json({
                    //"token": token,
                    "operation": operation
                });
            }).catch(this.catchFunction(res));
        };
    }

    /**
     * Indexes all Operations
     *
     * 
     * @memberOf OperationController
     */
    index() {
        return (req, res) => {
            this._operationDao.getAll(req.decoded).then(function(operations) {
                res.json(operations);
            }).catch(this.catchFunction(res));
        };
    }

    indexAuthorized() {
        return (req, res) => {
            if("decoded" in req) this._operationDao.getAuthorizedCRUD(req.decoded).then(function(operations) {
                    res.json(operations);
                }).catch(this.catchFunction(res));
            else this._operationDao.getAll().then(function(operations) {
                    res.json(operations);
                }).catch(this.catchFunction(res));
        };
    } 

    /**
     * Shows a single Operation
     *
     * 
     * @memberOf OperationController
     */
    show() {
        return (req, res) => {
            this._operationDao.getById(req.params.id, req.decoded).then(function(operation) {
                res.json(operation);
            }).catch(this.catchFunction(res));
        };
    }

    /**
     * Updates an Operation
     *
     * 
     * @memberOf OperationController
     */
    update() {
        return (req, res) => {
            this._operationDao.updateById(req.params.id, req.body, req.decoded).then(function(operation) {
                res.json(operation);
            }).catch(this.catchFunction(res));
        };
    }

    /**
     * Deletes an Operation
     *
     * 
     * @memberOf OperationController
     */
    destroy() { 
        return (req, res) => {
            this._operationDao.deleteById(req.params.id, req.decoded).then(function(operation) {
                res.json(operation);
            }).catch(this.catchFunction(res));
        };
    }

    /**
     * Deletes multiple Operations
     *
     * 
     * @memberOf OperationController
     */
    destroyMass() {
        return (req, res) => {
            let idArray = req.body.map(function(o){ return mongoose.Types.ObjectId(o); });

            this._operationDao.deleteMultiple(idArray, req.decoded).then(function(result) {
                res.json(result);
            })
            .catch(function(err) {
                console.log(err);
                res.json(err);
            });
        };
    }

    /**
     * Collects all operations from the central system and bulk inserts them into the database
     * 
     * 
     * @memberOf OperationController
     */
    collect() {
        return (req, res) => {
            if(req.decoded != null) 
                return res.json({
                    'success': false,
                    'message': "Unauthorized"
                });

            new Promise((resolve, reject) => {
                needle.request(config.central_system.collectOperations.requestMethod, config.central_system.collectOperations.URL, {}, function(err, resp, body) {
                    if(err) return reject('Something Went Wrong.');
                    if(!body.success) return reject('Something Went Wrong');
                    // if(body.error) return reject('Something Went Wrong. Possibly Wrong URL is Provided.');
                    if(body.length === 0) return reject('There Are no Operations');
                    resolve(body);
                });
            }).then(body => {
                // let o = { 'body': body }; // Wrap results in an object with 'body' key cause request can come also from a normal request
                return this._operationDao.batchInsert(body);
            }).then(docs => {
                res.json({ 
                    'success': true,
                    'documents': docs
                });
            }).catch(err => {
                res.json({ 
                    'success': false,
                    'message': err
                });
            });
        };
    }

}
