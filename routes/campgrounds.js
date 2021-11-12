const express = require("express");
// Express Router
const router = express.Router();
// importing controller for campground routes
const campgrounds = require("../controllers/campgrounds");
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");

// taking auth middleware
const {
  isLoggedIn,
  isAuthor,
  joiValidateCampground,
} = require("../middleware");

// Campground Routes
// / routes
router
  .route("/")
  // get all campgrounds
  .get(wrapAsync(campgrounds.index))
  // create a new compground
  .post(
    isLoggedIn,
    joiValidateCampground,
    wrapAsync(campgrounds.createNewCampground)
  );
// form for creating new campground
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);
// /:id routes
router
  .route("/:id")
  // get campground by id
  .get(wrapAsync(campgrounds.showCampgroundById))
  // update the campground by id
  .put(
    joiValidateCampground,
    isLoggedIn,
    isAuthor,
    wrapAsync(campgrounds.editCampgroundById)
  )
  // delete a campground by id
  .delete(isLoggedIn, wrapAsync(campgrounds.deleteCampgroundById));

// get edit page for campground by id
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampgroundForm)
);

module.exports = router;
