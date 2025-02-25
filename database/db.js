const mongoose = require("mongoose");

// Connect to MongoDB
const dbconnect = () => {


    mongoose.connect(process.env.DB_URL)
   
        .then(() => console.log("MongoDB Connected..."))
        .catch(err => console.error("MongoDB connection error:", err));
}

module.exports = dbconnect;

