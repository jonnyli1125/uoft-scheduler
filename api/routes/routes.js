var express = require('express');
var apiRoutes = express.Router();

// basic API route
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to this API! It is at http://localhost:8080/api' });
});

apiRoutes.post('/getcoords', function(req, res) {
  var encodedUrl = req.body.encoded_url;

  res.json({ message: "Here's the response: " + encodedUrl })

})

module.exports = apiRoutes;