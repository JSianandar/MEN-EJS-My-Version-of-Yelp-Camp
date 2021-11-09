const express = require("express");
// Express Router
const router = express.Router();
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");
// class for displaying message and stataus codes
const ExpressError = require("../utils/ExpressError");
// importing the model of the db schema
const CampGround = require("../models/campground");
// validation of campground and reviews using JOI
const { campgroundSchema } = require("../schemas");
// taking auth middleware
const { isLoggedIn } = require("../middleware");

// Validation middleware
const joiValidateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Campground Routes
// get all campgrounds
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// form for creating new campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// for creating new campground
router.post(
  "/",
  isLoggedIn,
  joiValidateCampground,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// get campground by id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "This campground is not available");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
// get edit page for campground by id
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// update the campground by id
router.put(
  "/:id",
  joiValidateCampground,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// delete a campground by id
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
