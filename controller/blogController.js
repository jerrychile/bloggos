const Blog = require('./../model/blogModel');
const Review = require('./../model/reviewModel');
const User = require('./../model/userModel');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./../util/appError');

exports.createBlog = async(req,res) => {
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
// console.log('This is our userName: ', userName);
// console.log('This is our decodedid: ', decoded.id);
    
    const newBlog = await Blog.create({
        title:req.body.title,
        body:req.body.body,
        createdAt:req.body.createdAt,
        author:userName.name,
        userId:decoded.id,
        number:  Math.floor(Math.random() * 9) + 1
        });

    res.status(201).json({
        status:'success',
        data:{
            blog: newBlog
        }
    })}catch(err){
      //  console.log(err);
    }
};

exports.getAllBlogs = async(req,res)=>{
    try{
        const blogs = await Blog.find();

        res.status(200).json({
            status:'success',
            results: blogs.length,
            data:{
                blogs
            }
        })
    }catch(err){
     //   console.log(err);
    }
};

exports.getBlog = async(req,res)=>{
    try{
        const blog = await Blog.find({_id:req.params.id});
        const reviews = await Review.find({_id:req.params.id})
        if(!blog){
            return
        }

        res.status(200).render('single',{
            status:'success',
            data:{
                blog,
                reviews
            }
        })

    }catch(err){
    //    console.log(err);
    }
}

exports.delete = async(req,res) =>{
    try{
    const blog = await Blog.remove({_id:req.params.id});
    
        res.status(204).json({
            status:'success' 
        })
    }catch(err){
        // console.log(err);
    }
    
    };