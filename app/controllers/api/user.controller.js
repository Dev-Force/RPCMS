import mongoose from 'mongoose';
import UserDao from '~/dao/user.dao';
import CRUControllerGenerator from '~/utils/controller/crud-controller-generator';

let CRUDController = CRUControllerGenerator('_userDao', new UserDao());

/**
 * 
 * 
 * @class UserController
 */
export default class UserController extends CRUDController { }
