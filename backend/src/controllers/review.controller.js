/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const getReviews = catchAsync(async (req, res) => {
  const result = await reviewService.getReviewsById(req.params.boId, req.params.page, req.params.limit);
  res.send(result);
});

const createReview = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(req.user.id, req.params.boId, req.body.rate, req.body.comment);
  res.send(result);
});

module.exports = {
  getReviews,
  createReview,
};
