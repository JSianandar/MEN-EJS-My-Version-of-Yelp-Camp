const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
// make every image when edit page to be 200 width
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const CampGroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    // for geocoding
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // getting the reviews schema from the review model
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

// make virtual for showing title and campground in cluster and also link in the cluster map
CampGroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description}</p>
  `;
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
