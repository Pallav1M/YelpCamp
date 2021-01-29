const Campground = require('../models/campground');
const Review = require('../models/review');

// CREATE REVIEWS
module.exports.createReviews = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campgrounds.reviews.push(review);
    await review.save();
    await campgrounds.save();
    req.flash('success', 'Created  new review!')
    res.redirect(`/campgrounds/${campgrounds._id}`);
};

// DELETING REVIEWS
module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;
    // pull will the Id and delete anything with that specific Id
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted  a review!')
    res.redirect(`/campgrounds/${id}`);
}