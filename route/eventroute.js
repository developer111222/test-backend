const express=require('express')
const router=express.Router();
const {createEvent,getAllEvents,getSingleEvent,updateEvent,deleteEvent} =require('../controller/eventcontroller')
const upload = require('../middleware/multer');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');


    router.route('/create-event').post(authorizationUser, authorizationRoles('admin'), upload.single('image'), createEvent);
    router.route('/get-event').get(getAllEvents);
    router.route('/get-single-event/:id').get(getSingleEvent);
    router.route('/update-event/:id').patch(authorizationUser,authorizationRoles('admin'),upload.single('image'),updateEvent)
    router.route('/delete-event/:id').delete(authorizationUser,authorizationRoles('admin'),deleteEvent)

    module.exports=router;