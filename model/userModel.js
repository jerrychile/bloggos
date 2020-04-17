const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {
        type:String,
        required:[true, 'Please enter your name']
    },

    email: {
        type:String,
        unique:true,
        required:[true, 'Please enter your email'],
        lowercase:true,
        validate:[validator.isEmail, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true, 'Please enter a password at least 8 characters long. Do not use repeating patterns'],
        minlength:3,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    }

});

userSchema.pre('save', async function(next){ // encrypt password
    if(!this.isModified('password'))return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

// instance method

userSchema.methods.correctPassword = async function(candidatePasssword, userPassword){
    return await bcrypt.compare(candidatePasssword, userPassword);
}


const User = mongoose.model('User', userSchema);

module.exports = User;