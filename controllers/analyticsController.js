const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore({ projectId: 'radio-follower' });

const kindNameResponses = 'media-responses';
const namespaceId = 'radio-follower';

/*
 * Get a unique conversation based on it's Id.
 */
exports.getConversation = function (req, res) {
    console.log('Get Conversation');
    if (typeof req?.params?.id === 'undefined') {
        const err = {
            code: 400,
            message: 'Bad Request. Missing ConversationId',
        };
        res.status(400).send(err);
        return;
    }

    var conversationId = req.params.id;

    const key = datastore.key({
        namespace: namespaceId,
        path: [kindNameResponses, parseInt(conversationId, 10)],
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

/*
 * Get all conversations relatd to a specific session. One session equals ond chat / discussion.
 */
exports.getConversationBySessionId = async (req, res) => {
    if (typeof req?.params?.id === 'undefined') {
        const err = {
            code: 400,
            message: 'Bad Request. Missing SessionId',
        };
        res.status(400).send(err);
        return;
    }
    var sessionId = req.params.id;
    getSession(sessionId)
        .then((data) => {
            return res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            const errM = {
                code: 400,
                message: 'Bad Request. Could not obtain session',
            };
            return res.status(404).send(errM);
        });
};

/*
 * Get all Conversations related to a specific userId and platform
 */
exports.getConversationByUserId = async (req, res) => {
    if (
        typeof req?.params?.id === 'undefined' ||
        typeof req?.params?.platform === 'undefined'
    ) {
        const err = {
            code: 400,
            message: 'Bad Request. Missing id (of user) or platform',
        };
        res.status(400).send(err);
        return;
    }
    const { userId, platform } = req.params;
    getUserSessions(userId, platform)
        .then((data) => {
            return res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            const errM = {
                code: 400,
                message: 'Bad Request. Could not obtain sessions',
            };
            return res.status(404).send(errM);
        });
};

const getSession = async (sessionId) => {
    return datastore
        .runQuery(
            datastore
                .createQuery(namespaceId, kindNameResponses)
                .filter('sessionId', '=', sessionId)
        )
        .then((resp) => {
            let conversation = [];
            if (typeof resp[0] === 'object') {
                resp[0].forEach((message) => {
                    console.log(message);
                    conversation.push(message);
                });
            }
            return Promise.resolve(conversation);
        });
};

const getUserSessions = async (userId, platform) => {
    return datastore
        .runQuery(
            datastore
                .createQuery(namespaceId, kindNameResponses)
                .filter('userId', '=', userId)
                .filter('platform', '=', platform)
        )
        .then((resp) => {
            let conversation = [];
            if (typeof resp[0] === 'object') {
                resp[0].forEach((message) => {
                    console.log(message);
                    conversation.push(message);
                });
            }
            return Promise.resolve(conversation);
        });
};
