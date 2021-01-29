const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// // REVIEW VALIDATION (moving it to the middleware file)
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// CREATING REVIEWS
// In order to view and post reviews, you must be logged in
// moving the functionality to the controller section
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReviews));

// /campgrounds/id/reviews/reviewId

// DELETING REVIEWS
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviews));

module.exports = router;
