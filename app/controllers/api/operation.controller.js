import mongoose from 'mongoose';
import OperationDao from '../../dao/operation.dao';

let Operation = mongoose.model('Operation');

class OperationController {

    constructor() {
        this.operationDao = new OperationDao();
    }

    catchFunction(res) {
        return function(err) {
            res.json(err);
        };
    }

    store = (req, res) => {
        this.operationDao.store(req).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

    index = (req, res) => {
        this.operationDao.index().then(function(operations) {
            res.json(operations);
        }).catch(this.catchFunction(res));
    }

    show = (req, res) => {
        this.operationDao.show(req).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

    update = (req, res) => {
        this.operationDao.update(req).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

    destroy = (req, res) => {
        console.log(req.params.id);
        this.operationDao.destroy(req).then(function(operation) {
            res.json(operation);
        }).catch(this.catchFunction(res));
    }

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
