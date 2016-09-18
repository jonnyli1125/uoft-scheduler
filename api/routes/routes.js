var express = require('express');
var apiRoutes = express.Router();
var path = require('path');
var allCourses = require(path.join(__dirname, '../', '../', './datasets/courses'));

// basic API route
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to this API! It is at http://localhost:8080/api' });
});

apiRoutes.post('/getcoords', function(req, res) {
  var encodedUrl = req.query.encoded_url;
  var day = req.query.day;
  var term = req.query.term;

  var rawCourses = new Buffer(encodedUrl, 'base64').toString().split(',');
  var decodedCourses = []

  rawCourses.map(function(dCourse) {
    // 9th character is the last digit of first code of 2
    if (term === dCourse[8]) {
      decodedCourses.push(dCourse)
    }
  })

  console.log("Decoded courses:", decodedCourses)

  courseData = getCourseData(decodedCourses, term, day)

  res.json({ message: "Here's the response: " + decodedCourses })
})

function getCourseData(courses, term, day) {
  courses.map(function(course) {
      var courseCode = course.split(' ')[0];
      var courseType = course.split(' ')[1];

      // console.log("Course Code: ", courseCode);
      // console.log("Course Type: ", courseType);

    allCourses.map(function(allCourse) {
      // console.log(courseCode + " vs " + allCourse.code)

      // First: search by course code
      if (courseCode === allCourse.code) {
        console.log("Found a match with " + courseCode + " and " + allCourse.code)

        // Second: search meeting_sections for the same lecture/tutorial code
        // Convention: first letter of Lec/Tut, followed by numerical code
        var meetingSections = allCourse.meeting_sections;

        meetingSections.map(function(meetingSection) {
          // 1st letter prefix + lecture/tut numerical suffix
          courseTypeSub = courseType[0] + courseType.substring(3, courseType.length)

          if (courseTypeSub === meetingSection.code) {
            console.log("Found a meeting match with " + courseTypeSub + " and " + meetingSection.code)

            // Third: search times to ensure Day is the same
            meetingSection.times.map(function(time) {
              if (day === time.day) {
                console.log("AND WE HAVE A DAY MATCH: " + day + " with " + time.day)
              }
            })
          }
        })
      }
    })
  })
}

module.exports = apiRoutes;