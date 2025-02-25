const mongoose=require('mongoose');
const slugify=require('slugify')


const gallerycategoryschema=new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    slug: {
        type: String,
        unique: true, // Ensures the slug is unique
        // Remove 'required' because we generate it automatically in the pre-save hook
        required: false
    },
},{timestamps:true});



gallerycategoryschema.pre('save', function (next) {
    if (this.isModified('category') || this.isNew) {
        this.slug = slugify(this.category, { lower: true, strict: true });
    }
    next();
});

module.exports=mongoose.model('GalleryCategory',gallerycategoryschema);
