import mongoose from 'mongoose';
import UserDao from '../../dao/user.dao';
import OperationDao from '../../dao/operation.dao';

let User = mongoose.model('User');

/**
 * 
 * 
 * @class UserUIController
 */
class UserUIController {

    _userDao;
    _operationDao;

    /**
     * Creates an instance of UserUIController.
     * 
     * 
     * @memberOf UserUIController
     */
    constructor() {
        this._userDao = new UserDao();
        this._operationDao = new OperationDao();
    }

    /**
     * High-Order function that returns the error function
     * 
     * @param {any} res
     * @returns
     * 
     * @memberOf OperationUIController
     * 
     * @returns {Function} the function to be used as callback on promise failure
     */
    catchFunction(res) {
        return function(err) {
            res.status(500).render('welcome', {
                'title': 'Error 500',
                'error': {
                    'message': `There was an error processing your request. ${err.toString()}` 
                }
            });
        };
    }

    /**
     * Shows all Users
     * 
     * 
     * @memberOf UserUIController
     */
    index = (req, res) => {
        let operations = null;
        this._operationDao.index().then(ops => {
            operations = ops;
            return this._userDao.index();
        }).then(function(users) {
            let ids = users.map(user => user._id);
            users = users.map(user => {
                let userOpStr = user.operations.map(opId => {
                    let op = operations.find(op => op._id.equals(opId));
                    if(op == null) return '';
                    return op.name;
                }).filter(str => str !== '').join(', ');

                return [
                    user.username, 
                    user.password,
                    user.admin,
                    userOpStr
                ];
            });

            res.render('crud/index', {
                'title': 'Users',
                'resourceURL': '/users',
                '_ids': ids,
                'headings': [
                    'Username',
                    'Password',
                    'Admin',
                    'Operations'
                ],
                'documents': users,
            });
        }).catch(this.catchFunction(res));
    }

    /**
     * Shows a single User
     * 
     * 
     * @memberOf UserUIController
     */
    show = (req, res) => {
        let operations = null;
        this._operationDao.index().then(ops => {
            operations = ops;
            return this._userDao.show(req);
        })
        .then(function(user) {
            let userOpStr = user.operations.map(opId => {
                let op = operations.find(op => op._id.equals(opId));
                if(op == null) return '';
                return op.name;
            }).filter(str => str !== '').join(', ');

            res.render('crud/show', {
                'title': 'Show User',
                'resourceURL': '/users',
                'document': {
                    'id': user._id,
                    'Username': user.username,
                    'Password': user.password,
                    'Admin': user.admin,
                    'Operations': userOpStr
                }
            });
        }).catch(this.catchFunction(res));
    }

    /**
     * Edits a User
     * 
     * 
     * @memberOf UserUIController
     */
    edit = (req, res) => {
        let user = null;
        this._userDao.show(req).then(u => {
            user = u;
            return this._operationDao.index();
        }).then(operations => {
            res.render('crud/edit', {
                'id': user._id,
                'resourceURL': '/users',
                'title': 'Update User',
                'action': 'Update',
                'fields': {
                    'username': user.username,
                    'password': user.password
                },
                'arrayFields': {},
                'selectFields': {
                    'operations': {
                        'documents': operations.map(op => {
                            let oper = {};
                            oper[op.name] = op._id;
                            return oper;
                        }),
                        'selected': user.operations.map(function(opId) { 
                            return operations.some(function(oper) {
                                return opId.equals(oper._id);
                            });
                         })
                    }
                },
                'checkboxFields': {
                    'admin': user.admin
                },
                'helpers': {
                    'indexTrue': function(array, index, opts){
                        if(array[index] === true) return opts.fn(this);
                        return opts.inverse(this);
                    }
                }
            });
        }).catch(this.catchFunction(res));
    }

    /**
     * Creates a User
     * 
     * 
     * @memberOf UserUIController
     */
    create = (req, res) => {
        this._operationDao.index().then(function(operations) {
            res.render('crud/create', {
                'resourceURL': '/users',
                'title': 'Create User',
                'action': 'Create',
                'fields': {
                    'username': 'Username',
                    'password': 'Password'
                },
                'selectFields': {
                    'operations': operations.map(op => {
                        let oper = {};
                        oper[op.name] = op._id;
                        return oper;
                    }),
                },
                'arrayFields': { },
                'checkboxFields': {
                    'admin': 'Administrator'
                },
            });
        });
    }

}

module.exports = UserUIController;