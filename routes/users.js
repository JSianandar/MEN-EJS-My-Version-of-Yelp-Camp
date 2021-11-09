const express = require("express");
// express Router
const router = express.Router();
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
// passport functionality
const passport = require("passport");

// route to go to register page
router.get("/register", (req, res) => {
  res.render("users/register");
});
// route to register a new user
router.post(
  "/register",
  wrapAsync(async (req, res) => {
    // if user hasnt exist yet
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      //login after registered
      req.login(registeredUser, (err) => {
        if (err) return next(err);
      });
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
      // if user already exist
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    //   if something goes wrong
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    // after logging in, you went to the last page be it new or edit campground
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Succesfully Logged Out!");
  res.redirect("/campgrounds");
});

module.exports = router;
