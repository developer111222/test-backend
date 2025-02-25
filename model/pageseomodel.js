const mongoose = require('mongoose');


const pageseoschema = new mongoose.Schema({
    meta_title: {
        type: String,
        required: true,
    },
    meta_description: {
        type: String,
        required: true,
    },
    meta_keywords: {
        type: String,
        // required: true,
    },
    page_url:{
        type: String,
        required: true,
        unique: true,
       
    }
}, { timestamps: true });

module.exports = mongoose.model('PageSEO', pageseoschema);