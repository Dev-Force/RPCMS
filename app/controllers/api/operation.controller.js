import Promise from 'bluebird';
import mongoose from 'mongoose';
import OperationDao from '../../dao/operation.dao';
import config from '../../../config/config';
import needle from 'needle';

let Operation = mongoose.model('Operation');

/**
 * 
 * 
 * @class OperationController
 */
class OperationController {

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
     * @param {Express.Response} res
     * @returns
     * 
     * @memberOf OperationController
     * 
     * @returns {Function}
     */
    catchFunction(res) {
        return function(err) {
            res.json(err);
        };
    }

    /**
     * Stores an Operation
     * 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * 
     * @memberOf OperationController
     */
    store = (req, res) => {
        this._operationDao.save(req.body).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

    /**
     * Indexes all Operations
     * 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * 
     * @memberOf OperationController
     */
    index = (req, res) => {
        this._operationDao.getAll().then(function(operations) {
            res.json(operations);
        }).catch(this.catchFunction(res));
    }

    /**
     * Shows a single Operation
     * 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * 
     * @memberOf OperationController
     */
    show = (req, res) => {
        this._operationDao.getById(req.params.id).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

    /**
     * Updates an Operation
     * 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * 
     * @memberOf OperationController
     */
    update = (req, res) => {
        this._operationDao.updateById(req.params.id, req.body).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

    /**
     * Deletes an Operation
     * 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * 
     * @memberOf OperationController
     */
    destroy = (req, res) => { 
        this._operationDao.deleteById(req.params.id).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

    /**
     * Deletes multiple Operations
     * 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * 
     * @memberOf OperationController
     */
    destroyMass = (req, res) => {
        let idArray = req.body['operations'].map(function(o){ return mongoose.Types.ObjectId(o); });

        this._operationDao.deleteMultiple(idArray).then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.json(err);
        });
    }

    /**
     * Collects all operations from the central system and bulk inserts them into the database
     * 
     * 
     * @memberOf OperationController
     */
    collect = (req, res) => {
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
    }

}

module.exports = OperationController;
