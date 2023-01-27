var userController = require('./controllers/userController');

module.exports = function (app) {
    app.route('/v1/user/:id').get(userController.getUser);

    app.route('/v1/user/:id/details').get(userController.getUserDetails);

    app.route('/v1/user').post(userController.createUser);
};
