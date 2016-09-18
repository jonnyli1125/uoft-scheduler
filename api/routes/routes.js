var express = require('express');
var apiRoutes = express.Router();
var path = require('path');
var allCourses = require(path.join(__dirname, '../', '../', './datasets/courses'));
var allBuildings = require(path.join(__dirname, '../', '../', './datasets/buildings'));

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

  res.json({ courseData })
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

                // We finally get a desirable match, bundle in all the information
                // and append to our 'dayCourses' array.

                var addressData = getLocationData(locationCode)

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
  allBuildings.map(function(building) {
    if (locationCode === building.code) {
      return {
        "address": {
          "street": bulding.address.street,
          "city": bulding.address.city,
          "province": bulding.address.province,
          "country": bulding.address.country,
          "postal": bulding.address.postal,
          "lat": building.lat,
          "lng": building.lng
        }
      };
    }
  })
}

module.exports = apiRoutes;