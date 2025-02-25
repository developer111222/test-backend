const mongoose=require('mongoose');

const newsletterschema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('Newsletter',newsletterschema)