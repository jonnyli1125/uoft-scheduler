var express = require('express');
var apiRoutes = express.Router();

// basic API route
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to this API! It is at http://localhost:8080/api' });
});

apiRoutes.post('/getcoords', function(req, res) {
  var encodedUrl = req.query.encoded_url;
  var day = req.query.day;
  var term = req.query.term;

  var decodedCourses = new Buffer(encodedUrl, 'base64').toString();

  res.json({ message: "Here's the response: " + decodedCourses })

})

module.exports = apiRoutes;