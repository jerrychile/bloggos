const Review = require('./../model/reviewModel');
const Blog = require('./../model/blogModel');
const User = require('./../model/userModel');

const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./../util/appError');

exports.getAllReviews = async(req,res,next)=>{
    try{
const reviews = await Review.find();

res.status(200).json({
    status:'success',
    data:{
        reviews
    }
})

    }catch(err){
        //('This is in the review controller');
    }
}

exports.createReview = async(req,res,next)=>{
    const newReview = await Review.create(req.body); // fields not in schema will be ignored

    res.status(201).json({
        status:'success',
        data:{
            newReview
        }
    })
}

exports.createRevieww = async(req,res) => {
    try{ 
        
     let token;
     let decoded;
 
     if(req.cookies.jwt){
         token = req.cookies.jwt;
     }
     
     if(!token){
         return next(new AppError('You are not logged in', 401));
     }
 
     try{
     decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
     
 
 }catch(err){
       
     }
 const userName = await User.findOne({_id:decoded.id});
 const blogId = req.params.id;
     
     const newReview = await Review.create({
         
         review:req.body.review,
         author:userName.name,
         blog:blogId,
         userId:decoded.id,
         comments:[{Comment:'First comment!', User:userName.name}]
         });
 
     res.status(201).json({
         status:'success',
         data:{
             newReview
         }
     })}catch(err){
       //  console.log(err);
     }
 };

exports.getReview = async(req,res)=>{
    try{
        const review = await Review.find({_id:req.params.id});

        if(!review){
            return
        }

        res.status(200).json({
            status:'success',
            data:{
                review
            }
        })

    }catch(err){
      //  console.log(err);
    }
}