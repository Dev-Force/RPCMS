import mongoose from 'mongoose';
import UserDao from '../../dao/user.dao';

let User = mongoose.model('User');

module.exports = class UserController {

    constructor() {
        this.userDao = new UserDao();
    }

    catchFunction(res) {
        return function(err) {
            res.json(err);
        };
    }

    store = (req, res) => {
        this.userDao.store(req).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    index = (req, res) => {
        this.userDao.index().then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    show = (req, res) => {
        this.userDao.show(req).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    update = (req, res) => {
        this.userDao.update(req).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    destroy = (req, res) => {
        this.userDao.destroy(req).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    destroyMass = (req, res) => {
        this.userDao.destroyMass(req).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }


};
