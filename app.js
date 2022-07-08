const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
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
app.use(express.urlencoded({extended:true})) // pass the req body 
app.use(methodOverride('_method'));

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

app.get('/camp/new', async(req, res) => {

    res.render('campground/new');

})

app.post('/camp', async(req, res) => {
    //const camp = new Campground({title:req.body.title, location: req.body.location});
    const camp = new Campground(req.body.campground); // req.body is key:value format which be used directly
    await camp.save();
    res.redirect(`/camp/${camp._id}`);
})

app.get('/camp/:id/edit', async(req,res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campground/edit',{camp});
})

app.get('/camp/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id);

    res.render('campground/show',{camp});


})

app.put('/camp/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/camp/${id}`)



})

app.delete('/camp/:id', async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/camp');

})

app.listen(3000, () => {

    console.log('Serving on port 3000');

})