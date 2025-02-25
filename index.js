const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const fs = require("fs");
const path = require("path");
const dbconnect=require('./database/db');
const cookieParser = require('cookie-parser');
const userRoute=require('./route/userroute');
const bannerroute=require('./route/bannerroute');
const blogroute=require('./route/blogroute');
const eventroute=require('./route/eventroute');
const formroute=require('./route/formroute');
const pageseoroute=require('./route/pageseoroute');
const blogcategory=require('./route/blocategoryroute');
const galleryroute=require('./route/galleryroute');
const newsletterroute=require('./route/newsletterroute');
// const orderroute=require('./route/orderroute');
const gallerycategoryroute=require('./route/gallerycategoryroute');

const crypto=require('crypto')
const upload=require('./middleware/multer')

const uploadDir = path.join(__dirname, "upload");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'https://sidhimanf.karnalwebtech.sbs',  
    methods: ["GET", "PUT", "POST", "DELETE","PATCH", "OPTIONS"],
    allowedHeaders: [
        "Access-Control-Allow-Origin",
        "Content-Type",
        "Authorization",
        "cookies"
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
};
app.use(cors(corsOptions));








app.use('/upload', express.static('upload'));



// Upload multiple images
app.post("/api/upload-images", upload.array("images", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    const filenames = req.files.map(file => file.filename);
    res.json({ filenames });
});

//-------get images---------------------

app.get("/api/get-images", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error reading directory" });
        }
        res.json({ images: files }); // Send image filenames
    });
}); 

//-------------database connection-----------

dbconnect();


//-------------api routes-----------
app.use('/api',userRoute);
app.use('/api',bannerroute);
app.use('/api',blogroute);
app.use('/api',eventroute);
app.use('/api',formroute);
app.use('/api',pageseoroute);
app.use('/api',blogcategory);
app.use('/api',galleryroute);
app.use('/api',newsletterroute);
// app.use('/api',orderroute);
app.use('/api',gallerycategoryroute);



//------------------start server------------------

const PORT=process.env.PORT 

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

//------------------end server------------------
