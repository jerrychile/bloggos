const express = require('express');
const viewsController = require('./../controller/viewsController');

const router = express.Router();


router.route('/:id').get(viewsController.getBlog).post(viewsController.createRevieww);


module.exports = router;