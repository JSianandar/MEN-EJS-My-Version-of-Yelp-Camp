const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  // getting the reviews schema from the review model
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
// middleware so when we delete a campground, the reviews will also be deleted
CampGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      //search for all the review id in reviews array in campground
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("CampGround", CampGroundSchema);
