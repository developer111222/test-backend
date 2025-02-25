const Gallery = require('../model/gallerymodel');
const GalleryCategory=require('../model/gallerycategorymodel');


//--------------------create gallery-------------


exports.creategallery = async (req, res) => {
    try {
        const image = req.files ? req.files.map(file => file.filename) : []; // Extract multiple filenames
        const category = req.body.category;

        console.log(image, "Uploaded Images");

        if (!image.length) {
            return res.status(400).json({ message: "Please upload at least one file" });
        }

        const gallery = new Gallery({ image, category });
        await gallery.save();

        return res.status(200).json({ message: "Successfully uploaded", gallery });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


//-----------------------------------get gallery--------------------------


exports.getgallery = async (req, res) => {

    try {
        const data = await Gallery.find().populate('category');

        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });

    }
}

//----------------------------get single gallery-------------------


exports.getSingleGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findById(id).populate('category');
        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found" });
        }
        return res.status(200).json(gallery);

    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


//------------------------------------get gallery by category---------------------------------

exports.getGalleryByCategory = async (req, res) => {
    const slug = req.params.id;

console.log(slug)
    try {
        // Step 1: Find the category based on the slug
        const category = await GalleryCategory.findOne({ slug: slug });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Step 2: Find all gallery items that belong to this category
        const galleries = await Gallery.find({ category: category._id })
            .populate('category', 'slug');

        // Step 3: Return the galleries
        return res.json({ success: true, galleries });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


//---------------------------update gallery-----------------------


exports.updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id, "Gallery ID", req.body);

        const { category } = req.body;
        const newImages = req.files?.map(file => file.filename) || [];    

        console.log(newImages, "Updated Images");

        // Find the existing gallery entry
        const gallery = await Gallery.findById(id);
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        const updatedData = {};

        // Update category if provided
        if (category) updatedData.category = category;

        // Keep old images if no new images are uploaded
        updatedData.image = newImages.length > 0 ? newImages : gallery.image;

        // Update the gallery entry
        const updatedGallery = await Gallery.findByIdAndUpdate(id, updatedData, { new: true });

        return res.status(200).json({ message: 'Gallery updated successfully', gallery: updatedGallery });

    } catch (error) {
        return res.status(500).json({ message: 'Failed to update gallery', error: error.message });
    }
};



//------------------------------------gelete gallery---------------------------------

exports.deletegallery = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Gallery.findByIdAndDelete(id);

        return res.status(200).json({ message: "deleted successfully", success: true })

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
} 