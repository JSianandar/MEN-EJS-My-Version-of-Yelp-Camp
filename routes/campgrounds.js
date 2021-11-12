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
// get all campgrounds
router.get("/", wrapAsync(campgrounds.index));

// form for creating new campground
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

// for creating new campground
router.post(
  "/",
  isLoggedIn,
  joiValidateCampground,
  wrapAsync(campgrounds.createNewCampground)
);

// get campground by id
router.get("/:id", wrapAsync(campgrounds.showCampgroundById));
// get edit page for campground by id
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampgroundForm)
);
// update the campground by id
router.put(
  "/:id",
  joiValidateCampground,
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampgroundById)
);
// delete a campground by id
router.delete("/:id", isLoggedIn, wrapAsync(campgrounds.deleteCampgroundById));

module.exports = router;
