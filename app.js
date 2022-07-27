const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const  Campground  = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const { transcode } = require('buffer');
const { campgroundSchema } = require('./schemas');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("database connected");

})


const app = express();

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true})) // pass the req body 
app.use(methodOverride('_method'));


const validatedCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    } 
    else {
        next();
    }


}


app.get('/',(req,res) => {
    //console.log('this is home');

    res.render('home');

})

app.get('/camp',catchAsync(async (req,res,next) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});

}))

app.get('/camp/new', catchAsync(async (req,res,next) => {

    res.render('campground/new');

}))

app.post('/camp', validatedCampground,catchAsync(async(req, res, next) => {
    //const camp = new Campground({title:req.body.title, location: req.body.location});
    const camp = new Campground(req.body.campground); // req.body is key:value format which be used directly
    await camp.save();
    res.redirect(`/camp/${camp._id}`);
}))

app.get('/camp/:id/edit', catchAsync(async (req,res,next) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campground/edit',{camp});
}))

app.get('/camp/:id',catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);

    res.render('campground/show',{camp});


}))

app.put('/camp/:id',validatedCampground,catchAsync(async (req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/camp/${id}`)



}))

app.delete('/camp/:id', catchAsync(async (req,res,next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/camp');

}))


app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', {err});


})
app.listen(3000, () => {

    console.log('Serving on port 3000');

})