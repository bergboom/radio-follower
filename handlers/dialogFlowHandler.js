const dialogflow = require('@google-cloud/dialogflow');
const region = 'europe-west2';
// projectId: ID of the GCP project where Dialogflow agent is deployed
// sessionId: String representing a random number or hashed user identifier
// languageCode: Indicates the language Dialogflow agent should use to detect intents

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient({
    apiEndpoint: 'europe-west2-dialogflow.googleapis.com',
});

//Use below lines when running on local machine
/*const sessionClient = new dialogflow.SessionsClient({
    keyFilename: '../radio-follower/.keys/radio-follower.json',
    apiEndpoint: 'europe-west2-dialogflow.googleapis.com',
});*/

function detectIntent(projectId, sessionId, query, contexts, languageCode) {
    // The path to identify the agent that owns the created intent. not able to handle different location currently.
    /*const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );*/
    const sessionPath = `projects/${projectId}/locations/${region}/agent/sessions/${sessionId}`;

    // The text query request.
    const request = {
        session: sessionPath,
        location: region,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    if (contexts && contexts.length > 0) {
        request.queryParams = {
            contexts: contexts,
        };
    }

    return sessionClient.detectIntent(request);
}
module.exports.detectIntent = detectIntent;
