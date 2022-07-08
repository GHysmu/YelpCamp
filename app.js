const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const  Campground  = require('./models/campground');

const { transcode } = require('buffer');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("database connected");

})


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/',(req,res) => {
    //console.log('this is home');

    res.render('home');

})
app.get('/makenewcamp', async (req,res) => {
    const camp = new Campground({title: 'My Backyard'});
    await camp.save();

    res.send(camp);


})

app.get('/camp', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});

})

app.get('/camp/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id);

    res.render('campground/show',{camp});


})

app.get('/camp/new', async(req, res) => {

    res.render('campground/new');

})

app.listen(3000, () => {

    console.log('Serving on port 3000');

})