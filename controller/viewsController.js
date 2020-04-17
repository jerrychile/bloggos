const Review = require('./../model/reviewModel');
const Blog = require('./../model/blogModel');
const User = require('./../model/userModel');

const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./../util/appError');

exports.getBlog = async(req,res)=>{
    try{
        
        const userId = req.params.id;
    //    console.log('This is our userId: ',userId);
        
        const blog = await Blog.findById(userId);
        const myBlogs = await Blog.find({_id:userId}).limit(3);
        const reviews = await Review.find({blog:userId});
        

        // console.log('Our blog/blogs ', blog, myBlogs);
        // console.log('These are our reviews: ', reviews);
         res.status(200).render('single',{
             blog,
             myBlogs,
             reviews
         });
 
     }catch(err){}
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
 const review = req.body.body;
//console.log('This is the body in the viewsController: ',review);

     const newReview = await Review.create({
         
         review:review,
         userName:userName.name,
         
         blog:blogId,
         userId:decoded.id,
         comments:[{Comment:'First comment!', User:userName.name}]
         });
 
         res.redirect(req.get('referer'));
        //  res.status(200).render('single',{
        //     blog,
        //     myBlogs,
        //     reviews,
        //     newReview
        // });
    }catch(err){
        // console.log(err);
     }
 };

