const express = require('express');
const router=express.Router();
const {creategallery,getgallery,deletegallery,getSingleGallery,updateGallery,getGalleryByCategory} =require('../controller/gallerycontroller');
const upload = require('../middleware/multer');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');



    router.route('/create-gallery').post(authorizationUser,authorizationRoles('admin'),upload.array('image',10),creategallery);
    router.route('/get-gallery').get(getgallery);
    router.route('/delete-gallery/:id').delete(authorizationUser,authorizationRoles('admin'),deletegallery);
    router.route('/get-single-gallery/:id').get(authorizationUser,authorizationRoles('admin'),getSingleGallery);
    router.route('/update-gallery/:id').patch(authorizationUser,authorizationRoles('admin'),upload.array('image',10),updateGallery);
    router.route('/get-gallery-by-category/:id').get(getGalleryByCategory);


    module.exports=router
