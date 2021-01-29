// const mongoose = require('mongoose');
// const Review = require('./review.js');
// const Schema = mongoose.Schema;

// const CampgroundSchema = new Schema({
//     title: String,
//     image: String,
//     price: Number,
//     description: String,
//     location: String,
//     reviews: [
//         {
//             type: Schema.Types.ObjectId,
//             ref: 'review'
//         }
//     ]
// });
// CampgroundSchema.post('findOneandDelete', async function (doc) {
//     if (doc) {
//         await Review.deleteMany({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// })

// module.exports = mongoose.model('Campground', CampgroundSchema);
// For reference
// https://res.cloudinary.com/dpa7nnd51/image/upload/w_200/v1610552106/YelpCamp/triblgapraznhjuyxlec.jpg

const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// https://mongoosejs.com/docs/tutorials/virtuals.html#virtuals-in-json
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

// this will include markup for the popup
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

// Campground Delete Middelware (deletes the reviews when deleteing a campground)

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
