var bodyParser = require('body-parser');
var express = require('express');
var routes = require('./routes');
var port = 3006;
var app = express();
var cors = require('cors');

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
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header(
            'Access-Control-Allow-Methods',
            req.headers['access-control-request-method']
        );
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header(
            'Access-Control-Allow-Headers',
            req.headers['access-control-request-headers']
        );
        oneof = true;
    }
    if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
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
