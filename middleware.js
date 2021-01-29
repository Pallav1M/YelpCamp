// IS LOGGED IN MIDDLEWARE - to redirect users to sign in while trying to create a new campground

const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER...', req.user); will display the user info in the terminal
    if (!req.isAuthenticated()) {
        // store the URL they are requesting
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

// JOI VALIDATION MIDDLEWARE
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// // AUTHORIZATION MIDDLEWARE
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
// REVIEW VALIDATION 
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}