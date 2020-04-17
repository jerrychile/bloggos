const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

title:{
    type:String,
    required:[true,'You blog piece needs a title!'],
    maxLength: 128,
},
body:{
    type:String,
    required:[true, 'We know its not a conspiracy. You know its not a conspirary. Tell us the truth!']
},
author:{
    type:String
},
number:{
    type:Number
  
},

createdAt:{
    type:Date,
    default:Date.now()
},

userId: String,
ratings:[Number],
comments:[{Comment: String,
            User:String}]

})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;