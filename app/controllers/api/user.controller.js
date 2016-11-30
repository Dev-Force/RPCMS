import mongoose from 'mongoose';
import UserDao from '../../dao/user.dao';

let User = mongoose.model('User');

/**
 * 
 * 
 * @class UserController
 */
export default class UserController {

    /**
     * Creates an instance of UserController.
     * 
     * 
     * @memberOf UserController
     */
    constructor() {
        this._userDao = new UserDao();
    }

    /**
     * 
     * 
     * @param {Express.Response} res
     * @returns {Function}
     * 
     * @memberOf UserController
     */
    catchFunction(res) {
        return function(err) {
            res.json(err);
        };
    }

    /**
     * Stores a User
     * 
     * @param {Express.Request} req
     * @param {Express.Reponse} res
     * 
     * @memberOf UserController
     */
    store = (req, res) => {
        this._userDao.save(req.body).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    /**
     * Indexes all Users
     * 
     * @param {Express.Request} req
     * @param {Express.Reponse} res
     * 
     * @memberOf UserController
     */
    index = (req, res) => {
        this._userDao.getAll().then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    /**
     * Shows a single User
     * 
     * @param {Express.Request} req
     * @param {Express.Reponse} res
     * 
     * @memberOf UserController
     */
    show = (req, res) => {
        this._userDao.getById(req.params.id).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    /**
     * Updates a User
     * 
     * @param {Express.Request} req
     * @param {Express.Reponse} res
     * 
     * @memberOf UserController
     */
    update = (req, res) => {
        this._userDao.updateById(req.params.id, req.body).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    /**
     * Deletes a User
     * 
     * @param {Express.Request} req
     * @param {Express.Reponse} res
     * 
     * @memberOf UserController
     */
    destroy = (req, res) => {
        this._userDao.deleteById(req.params.id).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

    /**
     * Deletes multiple Users
     * 
     * @param {Express.Request} req
     * @param {Express.Reponse} res
     * 
     * @memberOf UserController
     */
    destroyMass = (req, res) => {
        let idArray = req.body['users'].map(function(o){ return mongoose.Types.ObjectId(o); });

        this._userDao.deleteMultiple(idArray).then(function(result) {
            res.json(result);
        }).catch(this.catchFunction(res))
    }

}
