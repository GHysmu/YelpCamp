/**
 * create random camp random database 
 */

const mongoose = require('mongoose');
const path = require('path');
const cities = require('./cities');
const {descriptors, places} = require('./seedsHelper');

const Campground = require('../models/campground');
const { transcode } = require('buffer');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("database connected");

})

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async() => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*50);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author : '62e7d1b55481c52feed276e6',
            image: 'http://source.unsplash.com/collection/483251',
            description: 'this is a test description', 
            price: price
        })
        await camp.save(); 

    }

}

seedDB()
.then(() => {
    mongoose.connection.close();
    console.log('success')
})
.catch((err) => {console.log(err);});
