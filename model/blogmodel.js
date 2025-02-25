const mongoose = require('mongoose');
const slugify = require('slugify'); // If you want to create slugs automatically from titles

const blogSchema = new mongoose.Schema({
    metatitle: {
        type: String,
        // required: true
    },
    metadescription: {
        type: String,
        // required: true
    },
    metakeywords: {
        type: String,
        // required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogCategory',

    },
    slug: {
        type: String,
        unique: true, // Ensures the slug is unique
        // Remove 'required' because we generate it automatically in the pre-save hook
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// This will generate the slug automatically before saving the document
blogSchema.pre('save', function (next) {
    if (this.isModified('title') || this.isNew) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
