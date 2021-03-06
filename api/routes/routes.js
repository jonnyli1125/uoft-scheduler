var express = require('express');
var apiRoutes = express.Router();
var path = require('path');
var allCourses = require(path.join(__dirname, '../', '../', './datasets/courses'));
var allBuildings = require(path.join(__dirname, '../', '../', './datasets/buildings'));

// basic API route
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to this API! It is at http://localhost:8080/api' });
});

apiRoutes.get('/getcoords', function(req, res) {
  var callback = req.query.callback;
  var encodedUrl = req.body.encoded_url || req.query.encoded_url || req.headers['x-www-form-urlencoded'];
  var day = req.body.day || req.query.day || req.headers['x-www-form-urlencoded'];
  var term = req.body.term || req.query.term || req.headers['x-www-form-urlencoded'];

  var rawCourses = new Buffer(encodedUrl, 'base64').toString().split(',');
  var decodedCourses = []

  rawCourses.map(function(dCourse) {
    // 9th character is the last digit of first code of 2
    if (term === dCourse[8]) {
      decodedCourses.push(dCourse)
    }
  })

  courseData = getCourseData(decodedCourses, term, day)
  courseData.sort(function(a, b) { return a.section.start - b.section.start; });
  if (callback) {
    res.setHeader('Content-Type', 'text/javascript');
    res.end(callback + '(' + JSON.stringify(courseData) + ')');
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.end(courseData);
  }
})

function getCourseData(courses, term, day) {
  var dayCourses = []

  // "For every course the user has on Gidly..."
  courses.map(function(course) {
    var courseCode = course.split(' ')[0];
    var courseType = course.split(' ')[1];

    // "For every course offered at UofT..."
    allCourses.map(function(allCourse) {
      // First: search by course code
      if (courseCode === allCourse.code) {

        // Second: search meeting_sections for the same lecture/tutorial code
        // Convention: first letter of Lec/Tut, followed by numerical code
        var meetingSections = allCourse.meeting_sections;

        meetingSections.map(function(meetingSection) {
          // 1st letter prefix + lecture/tut numerical suffix
          courseTypeSub = courseType[0] + courseType.substring(3, courseType.length)

          if (courseTypeSub === meetingSection.code) {

            // Third: search times to ensure Day is the same
            meetingSection.times.map(function(time) {
              if (day === time.day) {

                // We finally get a desirable match, bundle in all the information
                // and append to our 'dayCourses' array.
                var addressData = getLocationData(time.location.substring(0, 2));

                courseBundle = {
                  'code': courseCode, // course
                  'name': allCourse.name,
                  'section': {
                    'code': meetingSection.code, // lecture/tutorial
                    'start': time.start,
                    'end': time.end,
                    'location': {
                      'room': time.location,
                      'address': addressData
                    }
                  }
                }

                dayCourses.push(courseBundle);
              }
            })
          }
        })
      }
    })
  })

  return dayCourses;
}

// Parses the building.json dataset for the respective location data
function getLocationData(locationCode) {
  var result = {}

  allBuildings.map(function(building) {

    if (locationCode === building.code) {

      result =  {
          "street": building.address.street,
          "city": building.address.city,
          "province": building.address.province,
          "country": building.address.country,
          "postal": building.address.postal,
          "lat": building.lat,
          "lng": building.lng
      }
    }
  })

  return result;
}

module.exports = apiRoutes;