var express = require('express');
var apiRoutes = express.Router();
var path = require('path');
var courses = require(path.join(__dirname, '../', '../', './datasets/courses'));

// var Post = require(path.join(__dirname, '../', './models/post'));

// basic API route
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to this API! It is at http://localhost:8080/api' });
});

apiRoutes.post('/getcoords', function(req, res) {
  // var courses = JSON.parse(courses)
  var encodedUrl = req.query.encoded_url;
  var day = req.query.day;
  var term = req.query.term;

  var decodedCourses = new Buffer(encodedUrl, 'base64').toString().split(',');
  var targetCourse;

  console.log("Decoded courses:", decodedCourses)

  decodedCourses.map(function(decCourse) {
    console.log("Course: ", decCourse)
  })

  // console.log("ALL THE COURSES IN THE WORLD: ", courses)

  res.json({ message: "Here's the response: " + decodedCourses })

})

module.exports = apiRoutes;