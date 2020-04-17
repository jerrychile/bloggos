const express = require('express');
const blogController = require('./../controller/blogController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/createblog').get(authController.protect, blogController.getAllBlogs).post(authController.protect, blogController.createBlog);
router.route('/:id').get(authController.protect, blogController.getBlog).delete(authController.protect, blogController.delete);



module.exports = router;