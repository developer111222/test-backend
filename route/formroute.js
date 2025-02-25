const express = require('express');
const router=express.Router();
const {createForm,getAllForms,deleteForm} =require('../controller/formcontroller');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');

//-------------------------routes-------------------

router.route('/create-form').post(createForm);
router.route('/get-all-forms').get(authorizationUser,authorizationRoles('admin'),getAllForms);
router.route('/delete-form/:id').delete(authorizationUser,authorizationRoles('admin'),deleteForm);

module.exports=router;

// router.route('/create-form').post(createForm);