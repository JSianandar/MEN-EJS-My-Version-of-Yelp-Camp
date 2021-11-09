const express = require("express");
// Express Router
const router = express.Router();
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");
// importing the model of the db schema
const CampGround = require("../models/campground");
// taking auth middleware
const {
  isLoggedIn,
  isAuthor,
  joiValidateCampground,
} = require("../middleware");

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
    const campground = new CampGround(req.body.campground);
    // set the author to be the logged in user
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// get campground by id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(campground);
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
  isAuthor,
  wrapAsync(async (req, res) => {
    if (!campground) {
      req.flash("error", "This campground is not available");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
// update the campground by id
router.put(
  "/:id",
  joiValidateCampground,
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
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
