import mongoose from 'mongoose';
import UserDao from '../../dao/user.dao';

let User = mongoose.model('User');

class UserUIController {

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
        res.render('auth/index', {

        });
        // UserDao.index().then(function(operations) {
        //     let ids = operations.map(operation => operation._id);
        //     operations = operations.map(operation => [operation.operationName, operation.positionalNumOfParams, operation.namedParams.join(', ')]);
        //     res.render('operation/index', {
        //         title: 'Operations',
        //         resourceURL: '/operations',
        //         _ids: ids,
        //         headings: [
        //             'Name',
        //             'Positional Number of Parameters',
        //             'Named Parameters'
        //         ],
        //         documents: operations,
        //     });
        // }).catch(this.catchFunction(res));

    }

}

module.exports = UserUIController;