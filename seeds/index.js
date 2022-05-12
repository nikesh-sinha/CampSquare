const mongoose = require('mongoose');
const cities = require('./indian');
const { places, descriptors } = require('./seedHelpers');
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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 150);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'609e2028ea363f21c432277f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ],
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/dise9clum/image/upload/v1621148680/Camp/dntk7killfictyt4s5dm.jpg',
                    filename: 'Camp/dntk7killfictyt4s5dm'
                },
                {
                    url: 'https://res.cloudinary.com/dise9clum/image/upload/v1621148828/Camp/pnnqc0ewrpg3roa8mvsy.jpg',
                    filename: 'Camp/pnnqc0ewrpg3roa8mvsy'
                 }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum blanditiis, totam obcaecati dolorum mollitia quae debitis nesciunt inventore eius, omnis facilis voluptatem laudantium cupiditate nihil nobis ea labore quis dolorem.',
            price:price,
        })
        await camp.save();
    }
}
seedDB();
seedDB().then(() => {
    mongoose.connection.close();
})
