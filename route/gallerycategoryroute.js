const express=require('express')
const router=express.Router();
const {createGalleryCategory,getAllGalleryCategories,deleteGalleryCategory,updateGalleryCategory} =require('../controller/gallerycategorycontroller')

const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');


    router.route('/crate-gallery-category').post(authorizationUser,authorizationRoles('admin'),createGalleryCategory);
    router.route('/get-gallery-category').get(getAllGalleryCategories);
    router.route('/delete-gallery-category/:id').delete(authorizationUser,authorizationRoles('admin'),deleteGalleryCategory);
    router.route('/update-gallery-category/:id').put(authorizationUser,authorizationRoles('admin'),updateGalleryCategory)



    module.exports=router;