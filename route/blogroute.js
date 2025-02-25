const express = require('express');
const router = express.Router();
const { createBlog, getAllBlogs, getBlogBySlug, updateBlog,deleteBlog,getBlogByCategory
} = require('../controller/blogcontroller');
const upload = require('../middleware/multer');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');


//-------------------------routes-------------------

router.route('/create-blog').post(authorizationUser, authorizationRoles('admin'), upload.single('image'), createBlog);
router.route('/blogs').get(getAllBlogs);
router.route('/single-blog/:id').get(getBlogBySlug)
router.route('/update-blog/:id').patch(authorizationUser, authorizationRoles('admin'), upload.single('image'), updateBlog);
router.route('/delete-blog/:id').delete(authorizationUser,authorizationRoles('admin'),deleteBlog)

router.route('/blog-by-category/:id').get(getBlogByCategory)

module.exports = router;


// This is how you can use this router in your app.js file: