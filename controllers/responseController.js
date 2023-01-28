const { v4: uuidv4 } = require('uuid');
const { detectIntent } = require('../handlers/dialogFlowHandler');
const { saveMessage } = require('../handlers/dataStorageHandler');
const projectId = 'radio-follower';

exports.sendMessage = function (req, res) {
    if (req?.body === 'undefiend') {
        const err = {
            code: 400,
            message: 'Bad Request. Missing body with languageCode and message',
        };
        res.status(400).send(err);
        return;
    }
    let {
        sessionId,
        languageCode,
        context,
        message,
        userId,
        platform,
        contactId,
    } = req.body;
    if (typeof sessionId === 'undefined') {
        sessionId = uuidv4();
    }
    if (typeof languageCode === 'undefined') {
        languageCode = 'en';
    }

    return detectIntent(projectId, sessionId, message, context, languageCode)
        .then((intentResponse) => {
            const response = intentResponse[0];
            const data = {
                action: response?.queryResult?.action,
                responseId: response?.responseId,
                responseMessage: response?.queryResult?.fulfillmentText,
                requestMessage: message,
                userId: userId,
                platform: platform,
                contactId: contactId,
                languageCode: response?.queryResult?.languageCode,
                sessionId: sessionId, //corresponds to a unique conversation. Keep the same for better conversation
                sessionContext: response?.queryResult?.outputContexts,
            };
            saveMessage(data);
            return res.status(201).send(data);
        })
        .catch((error) => {
            console.log(error);
            const err = {
                code: 400,
                message: 'Issue with DetectIntent',
            };
            res.status(400).send(err);
        });
};
