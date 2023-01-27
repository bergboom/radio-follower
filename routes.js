const responseController = require('./controllers/responseController');

module.exports = function (app) {
    app.route('/v1/responseToConversation/:id').get(
        responseController.getResponseToQuestion
    );

    app.route('/v1/saveConversation/:id').post(
        responseController.saveConversation
    );
};
