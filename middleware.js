// middleware for authentication whether user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //store the url they are requesting! and redirect back to login
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};
