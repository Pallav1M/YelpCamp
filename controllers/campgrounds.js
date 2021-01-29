const campground = require('../models/campground.js');
const Campground = require('../models/campground.js');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// FOR THE INDEX PAGE
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
};
// TO RENDER "CREATE A NEW CAMPGROUND PAGE"
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs')
};
// CREATE A NEW CAMPGROUND PAGE
module.exports.createCampground = async (req, res, next) => {
    // https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campgrounds.location,
        limit: 1
    }).send();
    const campgrounds = new Campground(req.body.campgrounds);
    campgrounds.geometry = geoData.body.features[0].geometry;
    campgrounds.images = req.files.map(f => ({
        url: f.path, filename: f.filename
    }));
    campgrounds.author = req.user._id;
    await campgrounds.save();
    console.log(campgrounds);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campgrounds._id}`);
};

// TO SHOW A CAMPGROUND PAGE
module.exports.showCampground = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        // this will populate the author of the review, and the author of the campground separately
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campgrounds);
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { campgrounds })
};
// TO RENDER CAMPGROUND EDIT AND UPDATE
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    // BASIC - AUTHORIZATION : CAMPGROUND PERMISSION (use just the middleware (isAuthor) instead)
    // if (!campgrounds.author.equals(req.user._id)) {
    //     req.flash('error', 'You do not have permission to do that');
    //     return res.redirect(`/campgrounds/${id}`);
    // }
    res.render('campgrounds/edit.ejs', { campgrounds })
};
// UPDATE CAMPGROUND PAGE
module.exports.updateCampground = async (req, res) => {
    // BASIC - AUTHORIZATION : CAMPGROUND PERMISSION 
    // Put the  lines below in the form of a middleware as const isAuthor (See above)
    const { id } = req.params;
    console.log(req.body);
    // // Put the commented lines below in the form of a middleware
    // const campgrounds = await Campground.findById(id);
    // if (!campgrounds.author.equals(req.user._id)) {
    //     req.flash('error', 'You do not have permission to do that');
    //     return res.redirect(`/campgrounds/${id}`);
    // }
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campgrounds })
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    // pushing additional images into the image gallery
    campgrounds.images.push(...imgs);
    // Deleteing images backend
    if (req.body.deleteImages) {
        // deleting from cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // pull from the images with a filename in req.body.deleteImages
        await campgrounds.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campgrounds);
    }
    await campgrounds.save();
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campgrounds._id}`)
};
// DELETE CAMPGROUND PAGE 
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    // const campgrounds = await Campground.findById(id);
    // // BASIC - AUTHORIZATION : CAMPGROUND PERMISSION 
    // if (!campgrounds.author.equals(req.user._id)) {
    //     req.flash('error', 'You do not have permission to do that');
    //     return res.redirect(`/campgrounds/${id}`);
    // }
    // findbyIDandDelete will find the findoneandDelete middleware
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds');
};