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
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new CampGround({
      // Your User ID
      author: "618a42557f386bcd6b5e7b1f",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: "Its a campground that we can see yay.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/domdibhxr/image/upload/v1637660111/YelpCamp/pfx37c6byu6whoazbgvf.jpg",
          filename: "YelpCamp/pfx37c6byu6whoazbgvf",
        },
        {
          url: "https://res.cloudinary.com/domdibhxr/image/upload/v1637660112/YelpCamp/mon8robmzsuids1lrl1b.jpg",
          filename: "YelpCamp/mon8robmzsuids1lrl1b",
        },
        {
          url: "https://res.cloudinary.com/domdibhxr/image/upload/v1637660112/YelpCamp/tqj6vrkmofioyzzgwfpv.jpg",
          filename: "YelpCamp/tqj6vrkmofioyzzgwfpv",
        },
      ],
    });
    await camp.save();
  }
};

seedDB();
