const { v4: uuidv4 } = require('uuid');
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore({ projectId: 'radio-follower' });

const kindNameResponses = 'media-responses';

const kindName = 'media-conversations';
const namespaceId = 'radio-follower';

exports.getResponseToQuestion = function (req, res) {
    console.log('Get Response to Question');
    if (typeof req?.body === 'undefined') {
        const err = {
            code: 400,
            message: 'Bad Request. Missing body',
        };
        res.status(400).send(err);
        return;
    }

    //Retrieve an answer option from an ML entity or such...

    var responseId = 1;

    const key = datastore.key({
        namespace: namespaceId,
        path: [kindNameResponses, parseInt(responseId, 10)],
    });

    datastore.get(key, (err, entity) => {
        if (!err && !entity) {
            err = {
                code: 404,
                message: 'Not found',
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
