const User = require('./../model/userModel');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./../util/appError');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRES_IN
     });
 }

 const createSendToken = (user, statusCode, res) =>{
    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    })

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            token
        }
    });
}

exports.signup = async(req,res)=>{
   try{ const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }); 

    const token = createSendToken(newUser,201,res);
}catch(err){}
};

exports.login = async(req,res,next) =>{
    try{
        const {email,password} = req.body;

        // 1 Check to see if email and password exist
        if(!email || !password){
            return next(new AppError('Please enter an email and password', 400));
        }

        // Check if user and password is correct
        const user = await User.findOne({email}).select('+password');
       

        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Incorrect email or password', 401))
        }

        const token = createSendToken(user,201,res);
        res.redirect('/home');

    }catch(err){
    //    console.log(err);
    }
};

exports.logout = (req,res) =>{
    let dateNow = Date.now() + 10 * 1000;
    //console.log('This is the date now',dateNow);
    res.cookie('jwt', 'loggedout',{
        
        httpOnly: true
    });
    res.status(200).render('login');
}

exports.protect = async(req,res,next)=>{
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }else if(req.cookies.jwt){
            token = req.cookies.jwt;
        }
     //   console.log('This is the token from authController.protect method:', token);

        if(!token){
           // return next(new AppError('You are not logged in', 401));
           res.status(404).render('404');
        }

        // verify token
        try{
            const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
            req.user = decoded.id; // May not work
            // console.log('This is in authController protect 2', req.user);
            // console.log('Same as above, decoded', decoded);
            // console.log('Same as above, decoded id', decoded.id);
        }catch(err){
            res.status(404).render('404');
        }


        next();
    }catch(err){
        res.status(404).render('404');
    }
}

