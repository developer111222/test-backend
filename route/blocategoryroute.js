const express = require('express');
const router = express.Router();
const { createBlogCategory,getAllBlogCategories,deleteCategory
} = require('../controller/blogcategorycontroller');
const upload = require('../middleware/multer');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');


router.route('/create-category').post(authorizationUser,authorizationRoles('admin'),createBlogCategory);
router.route('/get-all-category').get(getAllBlogCategories);
router.route('/delete-category/:id').delete(authorizationUser,authorizationRoles('admin'),deleteCategory)


module.exports=router