const GalleryCategory = require('../model/gallerycategorymodel');
const slugify = require('slugify');

//----------------------------------create category------------------------
exports.createGalleryCategory = async (req, res) => {
    const { formData } = req.body;
    console.log(formData, "cat")

    try {
        let categorydata = await GalleryCategory.findOne({ category: formData })
        if (categorydata) {
            return res.status(400).json({ message: "category already exists" })
        }

        categorydata = new GalleryCategory({ category: formData });
        await categorydata.save();
        return res.status(201).json({
            success: true,
            message: "Gallery category created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "server error",
            error: error.message
        });
    }
};

//----------------------------------get all categories------------------------
exports.getAllGalleryCategories = async (req, res) => {
    try {
        const categories = await GalleryCategory.find();
        return res.status(200).json({
            success: true,
            categories: categories
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            error: error.message
        });
    }
};


//----------------------------------update category------------------------


exports.updateGalleryCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        let updates = req.body; // Ensure JSON body is extracted

        console.log("Received ID:", categoryId);
        console.log("Received Updates:", updates);

        if (!updates || typeof updates !== "object") {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Find the existing category
        const category = await GalleryCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // If category name is being updated, generate a new slug
        if (updates.category) {

            const existingCategory = await GalleryCategory.findOne({
                category: updates.category,
                _id: { $ne: categoryId } // Exclude the current category from the search
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Category with this name already exists"
                });
            }

            updates.slug = slugify(updates.category, { lower: true, strict: true });
        }

        // Update the category
        const updatedCategory = await GalleryCategory.findByIdAndUpdate(
            categoryId,
            updates,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



//----------------------------------delete category------------------------
exports.deleteGalleryCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        console.log(req.params.id, "id")

        const category = await GalleryCategory.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            error: error.message
        });
    }
};
