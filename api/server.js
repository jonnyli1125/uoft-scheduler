// get the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

// configuration
var port = process.env.PORT || 8080;

// routes
var apiRoutes = require('./routes/routes');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to lo requests to the console
app.use(morgan('dev'));

// ~~~~~~~~~~~ Routes ~~~~~~~~~~~

// basic route
app.get('/', function(req, res) {
    res.json({ message: 'Welcome to the main route! The API is at http:localhost:' + port + '/api' });
});

// authentication routes
app.use('/api', apiRoutes);

// start the server
app.listen(port);
console.log('Server running at http://localhost:' + port);