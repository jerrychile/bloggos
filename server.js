require('dotenv/config');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const viewsRoutes = require('./routes/viewsRoute');
const reviewRoutes = require('./routes/reviewRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const Blog = require('./model/blogModel');
const User = require('./model/userModel');
const Review = require('./model/reviewModel');
const authController = require('./controller/authController');



const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./util/appError');


const app = express();
const DB = process.env.DB;

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con =>{
   // console.log('DB connection was a...... SUCCESS');
})

// setting view engine - EJS, not PUG
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


// middleware
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes

app.use('/user', userRoutes);
app.use('/user/:id', userRoutes)
app.use('/blog', blogRoutes);
app.use('/views', viewsRoutes);
app.use('/reviews', reviewRoutes);


app.get('/home',authController.protect,async (req,res)=>{
    try{
        const allBlogs = await Blog.find();
       

        res.status(200).render('index', {
            allBlogs
        });

    }catch(err){}
  
})



app.get('/login',async (req,res)=>{
    try{
        const allBlogs = await Blog.find();
       

        res.status(200).render('login', {
            allBlogs
        });

    }catch(err){}
  
})

app.get('/signup',async (req,res)=>{
    try{
        
       

        res.status(200).render('signup');

    }catch(err){}
  
})




app.get('/contact',async (req,res)=>{
    try{
        const allBlogs = await Blog.find();
        

        res.status(200).render('contact');

    }catch(err){}
  
})



app.get('/myblogs',async (req,res)=>{
    try{

        let token;
        let decoded;
    
        if(req.cookies.jwt){
            token = req.cookies.jwt;
        }
        
        if(!token){
            return next(new AppError('You are not logged in', 401));
        }
    
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        const myBlogs = await Blog.find({userId:decoded.id});
        

        res.status(200).render('myblogs',{
       myBlogs });

    }catch(err){}
  
})







app.get('/createblog', authController.protect,async (req,res)=>{
    try{

        
        res.status(200).render('createblog')
            
       

    }catch(err){
        
    }
  
})

app.post('/createblog' , async (req,res)=>{
    // try{ 
    //   //  const newBlogg = {title:req.no}
    //     const newBlog = await Blog.create(req.body);
    //     console.log(req.body);
    //     res.status(201).redirect('/home')}catch(err){
    //         console.log(err);
    //     }

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
            number:  Math.floor(Math.random() * 9) + 1});
    
        res.status(201).redirect('/myblogs'
           
            
        )}catch(err){
            res.status(404).render('404');
        }

})

app.get('*', function(req,res){
    res.status(500).render('404')
})

app.listen(8000,()=>{
    console.log('App is running on port 8000');
    console.log(path.join(__dirname, 'public'));
})