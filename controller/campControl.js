const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');

module.exports.index =  async (req,res,next) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});

}

module.exports.renderNewForm = async (req,res,next) => {

    res.render('campground/new');

}


module.exports.createCampground = async(req, res, next) => {
    
    //const camp = new Campground({title:req.body.title, location: req.body.location});
    const camp = new Campground(req.body.campground); // req.body is key:value format which be used directly
    await camp.save();
    req.flash('success','successfully create a new camp');
    res.redirect(`/camp/${camp._id}`);
}


module.exports.renderEditForm = async (req,res,next) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campground/edit',{camp});
}


module.exports.updateCampground = async (req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success','successfully update a new camp');
    res.redirect(`/camp/${id}`)



}


module.exports.showCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campground/show',{camp, msg:req.flash});


}

module.exports.deleteCampground = async (req,res,next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully delete a new camp');
    res.redirect('/camp');

}