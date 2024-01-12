const express = require('express');
const Review = require('../models/Review');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const { checkOrderExist, checkOrderHasReview, getOrderOwnerAccess } = require('../middlewares/database/databaseErrorHelpers');
const { getAllReviews, createReview } = require('../controllers/review');

const router = express.Router();

router.get('/', getAllReviews);
router.post('/:orderId/createreview', [getAccessToRoute, checkOrderExist, checkOrderHasReview, getOrderOwnerAccess], createReview);
// TODO: /:orderId/updatereview

module.exports = router;