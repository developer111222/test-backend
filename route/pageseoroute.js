const express = require('express');
const router = express.Router();
const { createPageSEO } = require('../controller/pageseocontroller');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');


//-------------------------routes-------------------


router.route('/create-page-seo').post(authorizationUser, authorizationRoles('admin'), createPageSEO);

module.exports = router;