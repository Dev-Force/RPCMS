import mongoose from 'mongoose';
import OperationDao from '../../dao/operation.dao';

let Operation = mongoose.model('Operation');

/**
 * 
 * 
 * @class OperationController
 */
class OperationController {

    /**
     * Creates an instance of OperationController.
     * 
     * 
     * @memberOf OperationController
     */
    constructor() {
        this.operationDao = new OperationDao();
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
        this.operationDao.store(req).then(function(operation) {
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
        this.operationDao.index().then(function(operations) {
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
        this.operationDao.show(req).then(function(operation) {
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
        this.operationDao.update(req).then(function(operation) {
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
        this.operationDao.destroy(req).then(function(operation) {
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

}

module.exports = OperationController;
