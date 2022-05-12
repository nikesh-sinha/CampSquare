const Campground = require('../models/campground');
const Review = require('../models/reviews');

module.exports.createReview = async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    campground.reviewCount=campground.reviewCount+1;
    campground.ratingSum=campground.ratingSum+parseInt(req.body.review.rating);
    campground.avgRating=(campground.ratingSum)/(campground.reviewCount);
    console.log(campground.ratingSum);
    console.log(campground.reviewCount);
    console.log(campground.avgRating);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(req,res) => {
    const {id,reviewId} = req.params;
    const campground = await Campground.findById(id);
    const review = await Review.findById(reviewId);
    campground.reviewCount=campground.reviewCount-1;
    campground.ratingSum=campground.ratingSum-review.rating;
    if(campground.reviewCount==0){
        campground.avgRating=0;
    } else {
        campground.avgRating = campground.ratingSum/campground.reviewCount;
    }
    await Campground.findByIdAndUpdate(id,{ $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    await campground.save();
    console.log(campground.ratingSum);
    console.log(campground.reviewCount);
    console.log(campground.avgRating);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
};