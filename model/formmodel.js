const mongoose = require('mongoose');


const formschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
     
        validate: {
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: 'Invalid email format'
        }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        // validate: {
        //     validator: (phone) => /^\+[1-9]\d{1,14}$/.test(phone),
        //     message: 'Invalid phone number format'
        // }
    },
    question: {
        type: String,
        required: true,
    },

},{timestamps:true}
)


const Form = mongoose.model('Form', formschema);

module.exports = Form;