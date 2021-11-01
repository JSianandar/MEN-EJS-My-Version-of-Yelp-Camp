// express server
const express = require("express");
// path
const path = require("path");
// mongoose
const mongoose = require("mongoose");
// for boilerplate purposes
const ejsMate = require("ejs-mate");
// for validation server-side
const Joi = require("joi");
// validation of campground using JOI
const { campgroundSchema } = require("./schemas");
// function for handling async errors
const wrapAsync = require("./utils/wrapAsync");
// class for displaying message and stataus codes
const ExpressError = require("./utils/ExpressError");
// so we can use PUT and DELETE method
const methodOverride = require("method-override");
// importing the model of the db schema
const CampGround = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const joiValidateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});
// get all campgrounds
app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// form for creating new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  joiValidateCampground,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);

    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// get campground by id
app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);
// get edit page for campground by id
app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// update the campground by id
app.put(
  "/campgrounds/:id",
  joiValidateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// delete a campground by id
app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);
// if no path/url matched then call this
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// for handling errors
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong, Error detected";
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  console.log("Serving on port 8080");
});
