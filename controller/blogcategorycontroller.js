const BlogCategory = require('../model/blogcategorymodel')
const Blog = require('../model/blogmodel');
//----------------------------------create category------------------------
exports.createBlogCategory = async (req, res) => {
    const category = req.body;

    try {
        let categorydata = await BlogCategory.findOne(category)
        if (categorydata) {
            return res.status(400).json({ message: "category already exists" })
        }

        categorydata = new BlogCategory(category);
        await categorydata.save();
        return res.status(201).json({
            success: true,
            message: "Blog category created successfully",

        });
    } catch (error) {
        res.status(500).json({
            message: "server error",
            error: error.message
        });
    }
};

//----------------------------------get all categories------------------------
exports.getAllBlogCategories = async (req, res) => {
    try {
      // Get all categories from the database
      const categories = await BlogCategory.find();
  
      // For each category, count the number of blogs associated with it.
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const blogCount = await Blog.countDocuments({ category: category._id });
          // Convert the Mongoose document to a plain object and add blogCount
          return { ...category.toObject(), blogCount };
        })
      );
  
      return res.status(200).json({
        success: true,
        categories: categoriesWithCounts
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
        error: error.message
      });
    }
  };
  

exports.deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;
        console.log(id)
        const category = await BlogCategory.findByIdAndDelete(id);

        return res.status(200).json({ messag: "deleted successfully" })


    } catch (error) {
        return res.status(500).json({
            message: "server error",
            error: error.message
        });
    }
}
