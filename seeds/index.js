const mongoose = require('mongoose');
const cities = require('./cities')
// const methodOverride = require('method-override');
const { places, descriptors } = require('./seedsHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // get the author id from mongo : db.users.find({'lizzy'})
            author: '5ff60ad31a8a8048ed0ade6e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum text is what we need to show some random text',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            // the following path has been taken from the terminal
            images: [
                {
                    url: 'https://res.cloudinary.com/dpa7nnd51/image/upload/v1611593754/YelpCamp/fmrg6sxa6e6ppqntaitt.jpg',
                    filename: 'YelpCamp/fmrg6sxa6e6ppqntaitt'
                },
                {
                    url: 'https://res.cloudinary.com/dpa7nnd51/image/upload/v1611593714/YelpCamp/cbmb0nyseemgnrdmfdlc.jpg',
                    filename: 'YelpCamp/cbmb0nyseemgnrdmfdlc'
                },
            ]
        })
        // Since image, description, and price have been added later, go to the mongo database to see that it has been updated. 
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
