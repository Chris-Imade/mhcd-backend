const express = require('express');
const { getAllCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/course');
const { verifyUser, verifyAdmin } = require('../lib/verifyToken');

const router = express.Router();

router.get('/', verifyUser, getAllCourses);
router.post('/', verifyAdmin, createCourse);
router.put('/:courseId', verifyAdmin, updateCourse);
router.delete('/:courseId', verifyAdmin, deleteCourse);

module.exports = router;