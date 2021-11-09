// class for displaying message and stataus codes
const ExpressError = require("./utils/ExpressError");
// validation of campground and reviews using JOI
const { campgroundSchema, reviewSchema } = require("./schemas");
// taking Campground Model
const CampGround = require("./models/campground");
// taking review model
const Review = require("./models/review");

// middleware for authentication whether user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //store the url they are requesting! and redirect back to login
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};

// Validation middleware
module.exports.joiValidateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// Middleware for checking whether the logged in user is the author of the selected campground
module.exports.isAuthor = async (req, res, next) => {
  // if the campground author is not the same with the logged in user
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Middleware for checking whether the logged in user is the author of the review in the campground
module.exports.isReviewAuthor = async (req, res, next) => {
  // if the review author is not the same with the logged in user
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Validation Middleware
module.exports.joiValidateCampgroundReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
