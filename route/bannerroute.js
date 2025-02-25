const express = require('express');
const router = express.Router();
const { createBanner, getAllBanners, updateBanner, deleteBanner
} = require('../controller/bannercontroller');
const upload = require('../middleware/multer');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');

//-------------------------routes-------------------

// router.route('/create-banner').post(upload.single('image'),createBanner);
router.route('/create-banner').post(authorizationUser, authorizationRoles('admin'), upload.single('image'), createBanner);
// authorizationRoles,upload.single('image'),createBanner);

router.route('/get-all-banners').get(getAllBanners);
// router.route('/update-banner/:id').put(authorizationUser, authorizationRoles('admin'), upload.single('image') , updateBanner);
router.route('/update-banner/:id').patch (authorizationUser, authorizationRoles('admin'), upload.single('image') , updateBanner);

router.route('/delete-banner/:id').delete(authorizationUser, authorizationRoles('admin'), deleteBanner);

module.exports = router;  