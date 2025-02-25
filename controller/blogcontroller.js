const Blog = require('../model/blogmodel');
const BlogCategory=require('../model/blogcategorymodel');
const { default: slugify } = require('slugify');

//-----------------------------create blog----------------------------------

exports.createBlog = async (req, res) => {
    console.log(req.body,req.file)
    try {
        const { title, content, metatitle, metadescription, metakeywords } = req.body;
        const image = req.file.filename;
        const author = req.user.id;
        const category = req.body.category;

        // Validate incoming data
        if (!title || !content || !image) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Create a new blog post
        const blog = new Blog({
            title,
            content,
            metatitle,
            metadescription,
            metakeywords,
            image,
            author,
            category
        });

        // Save the blog to the database
        await blog.save();

        return res.status(201).json({
            message: 'Blog post created successfully!',
            blog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create blog post', error: error.message });
    }
}



//-----------------------------get all blogs----------------------------------

exports.getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find().populate('author', 'username').populate('category', 'category slug').sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



//----------------------------------get blog by category--------------------------


exports.getBlogByCategory = async (req, res) => {
    const slug  = req.params.id;
    console.log(slug)

    try {
        // Step 1: Find the category based on the slug
        const category = await BlogCategory.findOne({ slug: slug });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Step 2: Find all blogs that belong to this category
        const blogs = await Blog.find({ category: category._id })
            .populate('author', 'username')
            .populate('category', 'slug'); // Only return slug here if needed

        // Step 3: Return the blogs
        return res.json({ success: true, blogs });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};





//-----------------------------get single blog by slug----------------------------------

exports.getBlogBySlug = async (req, res) => {
        try {
            const slug = req.params.id;
          
            const blog = await Blog.findOne({ slug }).populate('author', 'username');
            if (!blog) return res.status(404).json({ message: 'Blog not found' });
            res.status(200).json(blog);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve blog', error: error.message });
        }
    };


    //-----------------------------update blog----------------------------------


    exports.updateBlog = async (req, res) => {
        try {
            const slug = req.params.id;
     console.log(slug,"slug",req.body)
            const { title, content, metatitle, metadescription } = req.body;
            const image = req.file ? req.file.filename : null;
            
            const blog = await Blog.findOne({ slug: req.params.id });
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            
            // Regenerate slug if the title has changed
            if (title && title !== blog.title) {
                blog.title = title;
                blog.slug = slugify(title, { lower: true, strict: true }); // Update slug
            }
            
            // Check if slug already exists (excluding the current blog)
            if (req.body.slug && req.body.slug !== blog.slug) {
                const existingSlug = await Blog.findOne({ slug: req.body.slug });
                if (existingSlug) {
                    return res.status(400).json({ message: 'Slug already in use' });
                }
            }
            
            const updatedData = {};
            
            // Update fields based on the request body
            if (title) updatedData.title = title;
            if (content) updatedData.content = content;
            if (metatitle) updatedData.metatitle = metatitle;
            if (metadescription) updatedData.metadescription = metadescription;
            
            // Don't update the image if no new image is uploaded
            if (image !== null) {
                updatedData.image = image;
            } else {
                // Keep the old image if no new image is uploaded
                updatedData.image = blog.image;
            }
            
            // Save the blog with the updated slug and data
            const updatedBlog = await blog.save();  // Use save() to trigger the pre-save hook
            
            return res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });

        } catch (error) {
            return res.status(500).json({ message: 'Failed to update blog', error: error.message });
        }
    };


    //-------------------------------------------delete blog------------------------------

    exports.deleteBlog = async (req, res) => {
        try {
            const { id } = req.params;  // Access id directly from req.params
            console.log(id)
            const blog = await Blog.findByIdAndDelete(id);

            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            return res.status(200).json({ message: "Deleted successfully" });

        } catch (error) {
            return res.status(500).json({ message: "Failed to delete", error: error.message });
        }
    };
