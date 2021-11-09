const express = require("express");
// Express Router
const router = express.Router({ mergeParams: true });
//middlewaree
const {
  joiValidateCampgroundReviews,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware");
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");
// importing the model of the db schema
const CampGround = require("../models/campground");
// importing the model of the review schema
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");

// Review Routes
//make a new review for a specific campground
router.post(
  "/",
  isLoggedIn,
  joiValidateCampgroundReviews,
  wrapAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully made a new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// delete a review from a specific campground
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // Checking the desired review id to be deleted from the review array
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
