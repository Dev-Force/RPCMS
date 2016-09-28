import mongoose from 'mongoose';
import UserDao from '../../dao/user.dao';

let User = mongoose.model('User');

class UserUIController {

    constructor() {
        this.userDao = new UserDao();
    }

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

    index = (req, res) => {
        this.userDao.index().then(function(users) {
            let ids = users.map(user => user._id);
            users = users.map(user => [user.username, user.password, user.admin]);
            res.render('crud/index', {
                'title': 'Users',
                'resourceURL': '/users',
                '_ids': ids,
                'headings': [
                    'Username',
                    'Password',
                    'Admin'
                ],
                'documents': users,
            });
        }).catch(this.catchFunction(res));
    }

    show = (req, res) => {
        this.userDao.show(req).then(function(user) {
            res.render('crud/show', {
                'title': 'Show User',
                'resourceURL': '/users',
                'document': {
                    'id': user._id,
                    'Username': user.username,
                    'Password': user.password,
                    'Admin': user.admin
                }
            });
        }).catch(this.catchFunction(res));
    }

    edit = (req, res) => {
        this.userDao.show(req).then(function(user) {
            res.render('crud/edit', {
                'id': user._id,
                'resourceURL': '/users',
                'title': 'Update User',
                'action': 'Update',
                'fields': {
                    'username': user.username,
                    'password': user.password,
                    'admin': user.admin
                },
                'arrayFields': {}
            });
        }).catch(this.catchFunction(res));
    }

    create = (req, res) => {
        res.render('crud/create', {
            'resourceURL': '/users',
            'title': 'Create User',
            'action': 'Create',
            'fields': {
                'username': 'Username',
                'password': 'Password',
                'admin': 'Admin'
            },
            'arrayFields': { }
        });
    }

}

module.exports = UserUIController;