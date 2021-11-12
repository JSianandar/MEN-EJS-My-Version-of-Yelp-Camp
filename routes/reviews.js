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
// import review controller
const reviews = require("../controllers/reviews");

const ExpressError = require("../utils/ExpressError");

// Review Routes
//make a new review for a specific campground
router.post(
  "/",
  isLoggedIn,
  joiValidateCampgroundReviews,
  wrapAsync(reviews.createReview)
);
// delete a review from a specific campground
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
