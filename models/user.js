const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// passport for auth
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
// use passport plugin add username and password to the schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
