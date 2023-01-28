var bodyParser = require('body-parser');
var express = require('express');
var routes = require('./routes');
var port = 3006;
var app = express();
const cors = require('cors');
app.options('*', cors()); // include before other routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

/*app.use(
    cors({
        origin: ['http://localhost:4200'],
    })
);*/

app.get('/', (req, res) => {
    res.status(200).send('Hello Radio!');
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Change this if you want to only allow requests from a specific domain
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    ); // Change this to allow/disallow different headers
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS'); // Change this to disable/enable different HTTP methods (PUT,POST,DELETE,)
    next();
});

routes(app);
console.log(`Backend Started on port: ${port}`);
app.listen(port);

exports.radioFollowersApi = app;
