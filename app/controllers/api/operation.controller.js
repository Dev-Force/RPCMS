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
        this._operationDao.store(req).then(function(operation) {
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
        this._operationDao.index().then(function(operations) {
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
        this._operationDao.show(req).then(function(operation) {
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
        this._operationDao.update(req).then(function(operation) {
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
        this._operationDao.destroy(req).then(function(operation) {
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
        this.operationDao.destroyMass(req).then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.json(err);
        });
    }

    collect = (req, res) => {
        new Promise((resolve, reject) => {
            needle.request(config.central_system.collectOperations.requestMethod, config.central_system.collectOperations.URL, {}, function(err, resp, body) {
                if(err) return reject(Error('Something Went Wrong.'));
                if(body.error) return reject(Error('Something Went Wrong. Possibly Wrong URL is Provided.'))
                resolve(body);
            });
        }).then(body => {
            // TODO: Insert documents into db
            let o = { 'body': body };
            return this._operationDao.batchInsert(o);
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
