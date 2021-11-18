// importing the model of the db schema
const CampGround = require("../models/campground");

// All campgrounds controller method

module.exports.index = async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res, next) => {
  const campground = new CampGround(req.body.campground);
  // taking the filename and url to be put in mongodb
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // set the author to be the logged in user
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampgroundById = async (req, res) => {
  const campground = await CampGround.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "This campground is not available");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.editCampgroundForm = async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground) {
    req.flash("error", "This campground is not available");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampgroundById = async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampgroundById = async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
