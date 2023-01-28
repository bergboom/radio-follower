const { v4: uuidv4 } = require('uuid');
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore({ projectId: 'radio-follower' });
const { detectIntent } = require('../handlers/dialogFlowHandler');
const { saveMessage } = require('../handlers/dataStorageHandler');

const kindNameResponses = 'media-responses';

const kindName = 'media-conversations';
const namespaceId = 'radio-follower';
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
    let { sessionId, languageCode, context, message } = req.body;
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

exports.getResponseToQuestion = function (req, res) {
    console.log('Get Response to Question');
    if (typeof req?.params?.id === 'undefined') {
        const err = {
            code: 400,
            message: 'Bad Request. Missing id',
        };
        res.status(400).send(err);
        return;
    }

    //Retrieve an answer option from an ML entity or such...

    var responseId = req.params.id;

    const key = datastore.key({
        namespace: namespaceId,
        path: [kindNameResponses, parseInt(responseId, 10)],
    });

    datastore.get(key, (err, entity) => {
        if (!err && !entity) {
            err = {
                code: 404,
                message: 'Response Not found',
            };
        }
        if (err) {
            res.status(404).send(err);
            return;
        }
        res.status(201).send(entity);
    });
};

exports.saveConversation = function (req, res) {
    if (typeof req?.body !== 'undefined') {
        var conversationId = req?.body.conversationId;
        var currentMessage = req?.body.message;
        if (typeof currentMessage === 'undefined') {
            const err = {
                code: 400,
                message: 'message not found.',
            };
            res.status(400).send(err);
        }
        //Validators
        if (typeof conversationId === 'undefined') {
            console.log('existing conversation not found. Generating...');
            conversationId = uuidv4();
        }

        const dataToStore = {
            conversationId: conversationId,
            datetime: new Date().toISOString(),
            message: currentMessage.message,
            rawData: req?.body,
        };

        const saveKey = datastore.key({
            namespace: namespaceId,
            path: [kindName],
        });

        datastore.save(
            {
                key: saveKey,
                data: dataToStore,
            },
            (err) => {
                if (err) {
                    const errMsg = {
                        code: 400,
                        message: `Error Saving Record: ${err}`,
                    };
                    console.log(`Error Saving Record: ${err}`);
                    res.status(400).send(errMsg);
                } else {
                    res.status(201).json({
                        id: saveKey.id,
                        ...dataToStore,
                    });
                }
            }
        );
    } else {
        const err = {
            code: 400,
            message:
                'Incorrect conversation. Please add required mandatory fields.',
        };
        res.status(400).send(err);
    }
};
