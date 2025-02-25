const mongoose = require('mongoose');
const slugify = require('slugify'); // Add this import for slugify

// Define the gallery schema
const gallerySchema = new mongoose.Schema({
    image: [{
        type: String,
        required: true,
    }],
category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GalleryCategory',
        required: true
}
},{timestamps:true});

module.exports = mongoose.model('Gallery', gallerySchema);
