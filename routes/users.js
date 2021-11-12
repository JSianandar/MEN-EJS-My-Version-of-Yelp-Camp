const express = require("express");
// express Router
const router = express.Router();
// function for handling async errors
const wrapAsync = require("../utils/wrapAsync");
// passport functionality
const passport = require("passport");
//getting users controller
const users = require("../controllers/users");

// route to go to register page
router.get("/register", users.getRegisterForm);
// route to register a new user
router.post("/register", wrapAsync(users.register));
// route to render login page
router.get("/login", users.getLoginForm);
// route to login as a user
router.post(
  "/login",
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
