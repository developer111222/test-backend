const express = require('express');
const router = express.Router();
const {createOrder,verifyPayment,getAllPayments

}=require('../controller/ordercontroller');
const { authorizationUser,
    authorizationRoles } = require('../middleware/authToken');

router.route('/create-order').post(createOrder);
router.route('/verify-payment').post(verifyPayment);
router.route('/get-payment').get(authorizationUser,authorizationRoles("admin"),getAllPayments);


module.exports = router;



















