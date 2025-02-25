const express = require('express');
const router=express.Router();
const {createnewsletter,getnewsletter,deletenewsletter} =require('../controller/newslettercontroller');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');


    router.route('/create-newsletter').post(createnewsletter);
    router.route('/get-newsletter').get(authorizationUser,authorizationRoles('admin'),getnewsletter);
    router.route('/delete-newsletter/:id').delete(authorizationUser,authorizationRoles('admin'),deletenewsletter)


    module.exports=router