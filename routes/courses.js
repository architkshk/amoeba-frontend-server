const config = require('../config');
const deserializer = require('jsonapi-deserializer').deserialize;
const { cookHTML, getAPIdata, isNumeric } = require('../utils');

const express = require('express')
var route = express.Router();


route.get('/:id', async (req, res, next) => {

  let id = req.params.id

  let dataFetch = {}

  let getCourse = getAPIdata(config.API.COURSE_URL + id)
  let getRecommendedCourses = getAPIdata(config.API.RECOMMENDED_COURSE)

  Promise.all([getCourse, getRecommendedCourses]).then(async (values) => {
    dataFetch.course = deserializer(values[0])
    dataFetch.recommendedCourses = deserializer(values[1])

    const html = await cookHTML('course', {
      baseUrlApi: config.API.BASE_URL,
      course: dataFetch.course,
      recommendedCourses: dataFetch.recommendedCourses,
      epoch: Math.round((new Date()).getTime() / 1000)
    })

    res.send(html)
  }).catch((e) => {
    console.log(e);
    next();
  })

})

route.get('/', async (req, res, next) => {
    let dataFetch = {}
    try {
        let courses = await getAPIdata(config.API.COURSE_URL_WITH_INST_RUNS)
        dataFetch.courses = deserializer(courses)
        const html = await cookHTML('courses_all', {
            baseUrlApi: config.API.BASE_URL,
            courses: dataFetch.courses,
            epoch: Math.round((new Date()).getTime() / 1000)
        })
        res.send(html)
    } catch (error) {
        console.log(error);
        next();
    }
})

module.exports = route