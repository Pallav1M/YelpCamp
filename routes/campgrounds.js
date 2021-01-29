const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds.js');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

// const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground.js');
// const campground = require('../models/campground.js');

// Moving the middleware files to a separate file named - middleware.js

router.route('/')
    // DISPLAY ALL CAMPGROUNDS
    .get(catchAsync(campgrounds.index))
    // CREATE NEW CAMPGROUND
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
// TO UPLOAD AN ARRAY OF IMAGES(MULTIPLE IMAGES)
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("It worked!");
// })

// RENDER NEW FORM
// using isLoggedIn will ensure that it asks the user to first sign in to be able to create a new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
// See controllers 

router.route('/:id')
    // CAMPGROUND SHOW
    .get(catchAsync(campgrounds.showCampground))
    // CAMPGROUND UPDATE
    // "npm i method-override" in the terminal
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    // CAMPGROUND DELETE
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// CAMPGROUND EDIT AND UPDATE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;



