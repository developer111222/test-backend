const mongoose = require('mongoose');
const slugify = require('slugify');

// Define the Event schema
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Ensure title is required
        // trim: true
    },
    content: {
        type: String,
        required: true, // Ensure description is required
        // trim: true
    },
    image:{
type:String,

    },
    location: {
        type: String,
        required: true, // Ensure location is required
        // trim: true
    },
    startDate: {
        type: Date,
        required: true // Ensure start date is required
    },
    endDate: {
        type: Date,
        required: true // Ensure end date is required
    },
    openingTime: {
        type: String,
        required: true, // Ensure opening time is required
        // trim: true
    },
    closeTime: {
        type: String,
        required: true, // Ensure close time is required
        // trim: true
    },
    slug: {
        type: String,
        unique: true, // Ensures the slug is unique
        // Remove 'required' because we generate it automatically in the pre-save hook
        required: false 
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Middleware to create a slug from the title before saving the document
eventSchema.pre('save', function(next) { 
    if (this.isModified('title') || this.isNew) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
