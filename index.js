var bodyParser = require('body-parser');
var express = require('express');
var routes = require('./routes');
var port = 3006;
var app = express();
//var cors = require('cors');

/*const allowedOrigins = ['*', 'http://localhost:4200'];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    })
);

app.options('*', cors()); // include before other routes */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');

    // Request headers you wish to allow
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.options(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('Hello Radio!');
});
/*
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Change this if you want to only allow requests from a specific domain
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    ); // Change this to allow/disallow different headers
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS'); // Change this to disable/enable different HTTP methods (PUT,POST,DELETE,)
    
    next();
});*/

routes(app);
console.log(`Backend Started on port: ${port}`);
app.listen(port);

exports.radioFollowersApi = app;
