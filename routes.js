const responseController = require('./controllers/responseController');
const analyticsController = require('./controllers/analyticsController');

module.exports = function (app) {
    app.route('/v1/conversation/:id').get(analyticsController.getConversation);

    app.route('/v1/conversation/session/:id').get(
        analyticsController.getConversationBySessionId
    );
    app.route('/v1/conversation/platform/:platform/user/:id').get(
        analyticsController.getConversationByUserId
    );

    app.route('/v1/sendMessage').post(responseController.sendMessage);
};
