const express = require("express");
// express Router
const router = express.Router();
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");
// passport functionality
const passport = require("passport");
//getting users controller
const users = require("../controllers/users");

// all register routes
router
  .route("/register")
  // route to go to register page
  .get(users.getRegisterForm)
  // route to register a new user
  .post(wrapAsync(users.register));

// all login routes
router
  .route("/login")
  // route to render login page
  .get(users.getLoginForm)
  // route to login as a user
  .post(
    passport.authenticate("local", {
      //   if something goes wrong
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );
// route to logout as a user
router.get("/logout", users.logout);

module.exports = router;
