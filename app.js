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
// class for displaying message and stataus codes
const ExpressError = require("./utils/ExpressError");
// Express session
const session = require("express-session");
// Express flash for notifications after we did something
const flash = require("connect-flash");
// so we can use PUT and DELETE method
const methodOverride = require("method-override");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionConfig = {
  secret: "thishouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    //security for the http
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Middleware for Flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// Campground Routes
app.use("/campgrounds", campgrounds);
// Review Routes
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home");
});

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
