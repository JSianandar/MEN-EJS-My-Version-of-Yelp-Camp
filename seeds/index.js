const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const CampGround = require("../models/campground");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];
// seed 50 places
const seedDB = async () => {
  await CampGround.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new CampGround({
      author: "618a42557f386bcd6b5e7b1f",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "Its a campground that we can see yay.",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/domdibhxr/image/upload/v1637223133/YelpCamp/thcd1yx6aujwm4vy68is.jpg",
          filename: "YelpCamp/thcd1yx6aujwm4vy68is",
        },
        {
          url: "https://res.cloudinary.com/domdibhxr/image/upload/v1637223134/YelpCamp/alnbrov8hehnlrfg4myb.jpg",
          filename: "YelpCamp/alnbrov8hehnlrfg4myb",
        },
        {
          url: "https://res.cloudinary.com/domdibhxr/image/upload/v1637223134/YelpCamp/rl1l9c8ec7karuwkefo7.jpg",
          filename: "YelpCamp/rl1l9c8ec7karuwkefo7",
        },
      ],
    });
    await camp.save();
  }
};

seedDB();
