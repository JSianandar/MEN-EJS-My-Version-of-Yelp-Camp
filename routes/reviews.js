const express = require("express");
// Express Router
const router = express.Router({ mergeParams: true });
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");
// class for displaying message and stataus codes
const ExpressError = require("../utils/ExpressError");
// importing the model of the db schema
const CampGround = require("../models/campground");
// importing the model of the review schema
const Review = require("../models/review");
// validation of campground and reviews using JOI
const { reviewSchema } = require("../schemas");

// Validation Middleware
const joiValidateCampgroundReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Review Routes
//make a new review for a specific campground
router.post(
  "/",
  joiValidateCampgroundReviews,
  wrapAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// delete a review from a specific campground
router.delete(
  "/",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // Checking the desired review id to be deleted from the review array
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
