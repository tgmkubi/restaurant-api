const express = require('express');
const Review = require('../models/Review');
// const reviewQueryMiddleware = require('../middlewares/query/reviewQueryMiddlewares');
const { getAllReviews } = require('../controllers/review');

const router = express.Router();

router.get('/', getAllReviews);

module.exports = router;