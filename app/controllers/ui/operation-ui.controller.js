import mongoose from 'mongoose';
import OperationDao from '../../dao/operation.dao';

let Operation = mongoose.model('Operation');

class OperationUIController {

    constructor() {
        this.operationDao = new OperationDao();
    }

    catchFunction(res) {
        return function(err) {
            res.status(500).render('welcome', {
                title: 'Error 500',
                error: {
                    message: `There was an error processing your request. ${err.toString()}` 
                }
            });
        };
    }

    index = (req, res) => {
        this.operationDao.index().then(function(operations) {
            let ids = operations.map(operation => operation._id);
            operations = operations.map(operation => [operation.name, operation.positionalNumOfParams, operation.namedParams.join(', ')]);
            res.render('crud/index', {
                title: 'Operations',
                resourceURL: '/operations',
                _ids: ids,
                headings: [
                    'Name',
                    'Positional Number of Parameters',
                    'Named Parameters'
                ],
                documents: operations,
            });
        }).catch(this.catchFunction(res));
    }

    show = (req, res) => {
        this.operationDao.show(req).then(function(operation) {
            res.render('crud/show', {
                'title': 'Show Operation',
                'resourceURL': '/operations',
                'document': {
                    'id': operation._id,
                    'Positional Number of Parameters': operation.positionalNumOfParams,
                    'Named Parameters': operation.namedParams.join(', ')
                }
            });
        }).catch(this.catchFunction(res));
    }

    edit = (req, res) => {
        this.operationDao.show(req).then(function(operation) {
            res.render('crud/edit', {
                id: operation._id,
                resourceURL: '/operations',
                title: 'Update Operation',
                action: 'Update',
                fields: {
                    'name': operation.name,
                    'positionalNumOfParams': operation.positionalNumOfParams
                },
                arrayFields: {
                    'namedParams': operation.namedParams
                }
            });
        }).catch(this.catchFunction(res));
    }

    create = (req, res) => {
        res.render('crud/create', {
            resourceURL: '/operations',
            title: 'Create Operation',
            action: 'Create',
            fields: {
                'name': 'Operation',
                'positionalNumOfParams': 'Positional Number of Parameters'
            },
            arrayFields: {
                'namedParams': 'Named Parameters'
            }
        });
    }

}

module.exports = OperationUIController;