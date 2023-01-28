const { v4: uuidv4 } = require('uuid');
const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore({ projectId: 'radio-follower' });
const kindNameResponses = 'media-responses';

//const kindName = 'media-conversations';
const namespaceId = 'radio-follower';

exports.saveMessage = function (data) {
    return new Promise((resolve, reject) => {
        if (typeof data?.sessionId !== 'undefined') {
            let {
                sessionId,
                requestMessage,
                responseMessage,
                userId,
                contactId,
                platform,
            } = data;
            if (
                typeof requestMessage === 'undefined' ||
                typeof responseMessage === 'undefined'
            ) {
                const err = {
                    code: 400,
                    message: 'messages not found.',
                };
                return reject(err);
                //res.status(400).send(err);
            }
            //Validators
            if (typeof sessionId === 'undefined') {
                console.log('existing conversation not found. Generating...');
                sessionId = uuidv4();
            }

            const dataToStore = {
                sessionId: sessionId,
                datetime: new Date().toISOString(),
                userId: userId,
                platform: platform,
                contactId: contactId,
                requestMessage: requestMessage,
                responseMessage: responseMessage,
                rawResponseData: data,
            };

            const saveKey = datastore.key({
                namespace: namespaceId,
                path: [kindNameResponses],
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
                        return reject(errMsg);
                        //res.status(400).send(errMsg);
                    } else {
                        return resolve({ id: saveKey.id, ...data });
                        /* res.status(201).json({
                            id: saveKey.id,
                            ...data,
                        });*/
                    }
                }
            );
        } else {
            const err = {
                code: 400,
                message:
                    'Incorrect conversation. Please add required mandatory fields.',
            };
            return reject(err);
            //res.status(400).send(err);
        }
    });
};
