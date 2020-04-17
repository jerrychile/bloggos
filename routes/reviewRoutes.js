const reviewController = require('./../controller/reviewController');
const express = require('express');

const router = express.Router();

router.route('/').get(reviewController.getAllReviews).post(reviewController.createReview);
router.route('/:id').get(reviewController.getReview);

module.exports = router;
