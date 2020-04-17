const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required: [true, 'You can not post an empty review!']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    userName:String, 
    blog:{
        type: mongoose.Schema.ObjectId,
        ref: 'Blog',
        required:[true,'Review must belong to a blog']
    }  
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}}
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;